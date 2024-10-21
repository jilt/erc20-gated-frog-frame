/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput, postComposerCreateCastActionMessage } from 'frog'
import { devtools } from 'frog/dev'
import { pinata } from 'frog/hubs'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import { getAddress } from './fetch'
import { checkBalance } from './gate'
import './globals.css'


import { createSystem, colors } from "frog/ui";

const { Box, Heading, Text, VStack, Image, vars } = createSystem({
  colors: colors.dark,
});

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  ui: { vars },
  // hub: pinata(),
});

let fidi = undefined;

app.frame('/', async (c) => {
    const { status, frameData, buttonValue, inputText } = c
    fidi = frameData?.fid
    const service = c.buttonValue
    ask = frameData?.inputText
    return c.res({
        image: (
      <Box grow alignVertical="center" >
          <Image src="/ambrogio.jpg" alt="frameImg" objectFit="cover" width="100%" height="100%" postion="relative" />
      </Box>
    ),
    intents: [
        service !=="check" && <Button action="/ambrogio" value="Ambrogio">I need the token</Button>,
        service !=="check" && <Button value="check">I'm Homie</Button>,
        service ==="check" && <Button value="check" action="/check">Let's check</Button>,
    ],
  })
})

// add your token here
app.use('/ambrogio/*', async (c, next) => {
  try{
    const res = await fetch('https://api.cryptorank.io/v0/coins/prices?keys=toshi&currency=USD', {headers:{'Content-Type':'application/json', Origin:"https://cryptorank.io", Referer:"https://cryptorank.io/"}})
    if (!res.ok) return ({error:res.statusText+' ('+res.status+')'})
    const data = await res.json()
    c.set('price', data?.data[0]?.price)
    c.set('vol', data?.data[0]?.volume)
  }catch(error){
    console.log(error)
  }
  await next()
})

// this frame uses swapbot, add your token on line 86 (button)
app.frame('/ambrogio', (c) => {
  const { buttonValue, inputText, frameData } = c
  return c.res({
      image: (
        <Box grow alignVertical="center" backgroundColor="blue100" padding="32">
        <VStack gap="4">
          <Heading>{c.buttonValue}</Heading>
          <Text color="blue900" size="24">
            Will get you 1 TOSHI for {c.var.price} $
          </Text>
          <Text color="blue800" size="18">
            TVL {c.var.vol} $
          </Text>
        </VStack>
      </Box>
      ),
      intents: [
          <Button.Link href="https://warpcast.com/~/compose?text=buy%20toshi%20@swapbot">Buy Toshi</Button.Link>,
          <Button.Reset>Back</Button.Reset>,
      ],
  })
})

app.use('/check/*', async (c, next) => {
  let realAddresses: string[] = getAddress(fidi)
  let token = await checkBalance(realAddresses)
  c.set('fam', token)
  await next()
})

app.frame('/check', async (c) => {
    const { buttonValue, inputText, frameData } = c
    let fam = c.var.fam
    return c.res({
        image: (
          <Box grow alignVertical="center" backgroundColor="blue100" padding="32">
          <VStack gap="4">
            <Heading>You're Fam</Heading>
          </VStack>
          </Box>
        ),
        intents: [
            fam === true && <Button.Link href="https://vault.varda.vision">Built by Varda</Button.Link>,
            <Button.Reset>Back</Button.Reset>,
        ],
    })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
