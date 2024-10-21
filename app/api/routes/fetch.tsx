export async function getAddress(fid: number) {

    const url = `https://searchcaster.xyz/api/profiles?fid=1235`;
    const requestOptions = {
        cache: 'no-store'
    };

    // console.log(`Fetching address for: ${fid}`);

    const maxRetries = 10;
    let attempts = 0;

    while (attempts <= maxRetries) {
        try {
            const response = await fetch(url, requestOptions);
            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const body = await response.text();
            const result = JSON.parse(body);
            return result;
        } catch (error) {
            console.error(`Attempt ${attempts + 1}: Unable to fetch data - ${error}`);
            attempts++;
            if (attempts > maxRetries) {
                throw new Error(`Failed to fetch data after ${maxRetries} attempts`);
            }
        }
    }
}