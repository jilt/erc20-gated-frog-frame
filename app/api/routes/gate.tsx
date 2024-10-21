import { abi } from './abi'
const { Web3 } = require("web3")
const web3 = new Web3(
    new Web3.providers.HttpProvider(
        "https://base-mainnet.g.alchemy.com/v2/NA_BxX97eWdpoMTO1kFKSvr_M2Tayh6M"
    ),
)

export async function checkBalance(addresses: string[] = []) {

    // TOSHI token contract
    let i = 0;
    const tokenContract = "0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4"

    function checkValue(val: string) {
        return val !== '0.';
    }

    // loop through addresses list
    while (i < addresses.length) {
        try {
            const contract = new web3.eth.Contract(abi, tokenContract)
            const result = await contract.methods.balanceOf(addresses[i]).call()
            const formattedResult = await web3.utils.fromWei(result, "ether")
            if (formattedResult != '0.') {
                let fam = true
                return fam
            }
            i++;
        } catch (error) {
            console.error(`Attempt ${addresses[i] + 1}: not fam - ${error}`);
            i++;
        }
    }

    }