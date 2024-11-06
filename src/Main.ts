import fs from 'fs';
import WSocket from './Core/WSocket';

const UID: string = "2XXXXXXXXXXXXXXXXXXXXXXXXXX"; // Change Your UID
const SLEEP: number = 20000; // Re - Connect After (ms)

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function connect(PROXY: string) {
    const sock: WSocket = new WSocket({
        "ipCheckURL": "https://ipinfo.io/json",
        "wssHost": "proxy.wynd.network:4444"
    });

    return await sock.connectToProxy(PROXY, UID);
}

async function handleProxyConnection(proxy: string) {
    let currentlyConnect: number = 0;
    let currentlyStatus = await connect(proxy);

    try {
        while (currentlyConnect < 5 && currentlyStatus) {
            await sleep(SLEEP);

            currentlyStatus = await connect(proxy);
            currentlyConnect++;
            
            if (currentlyStatus) {
                console.log(`Proxy ${proxy} connection still failed, retrying...`);
            } else {
                console.log(`Proxy ${proxy} connection deprecated.`);
                break;
            }
        }

        if (currentlyConnect >= 5) {
            console.log(`Max retries for proxy ${proxy} reached, exiting...`);
        }
    } catch (error) {
        console.log(`Error occurred with proxy ${proxy}, exiting...`);
    }
}

async function run() {
    fs.readFile('proxy.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading proxy.txt:', err);
            return;
        }
        const proxies = data.split('\n').map(proxy => proxy.trim()).filter(proxy => proxy);
        Promise.all(proxies.map(proxy => handleProxyConnection(proxy)))
            .then(() => {
                console.log('All proxy connection attempts finished.');
            })
            .catch((error) => {
                console.error('An error occurred during the proxy connection attempts:', error);
            });
    });
}

run();
