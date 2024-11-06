import 'colors';
import WebSocket from 'ws';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { HttpsProxyAgent } from 'https-proxy-agent';

interface Config {
    ipCheckURL: string;
    wssHost: string;
}

interface Message {
    id: string;
    action: string;
    [key: string]: any;
}

class WSocket {
    private config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    private async getProxyIP(proxy: string): Promise<any | null> {
        const agent = proxy.startsWith('http')
            ? new HttpsProxyAgent(proxy)
            : new SocksProxyAgent(proxy);
        try {
            const response = await axios.get(this.config.ipCheckURL, {
                httpsAgent: agent,
            });
            console.log(`Connected through proxy ${proxy}`.green);
            return response.data;
        } catch (error) {
            console.error(
                `Skipping proxy ${proxy} due to connection error: ${error.message}`
                    .yellow
            );
            return null;
        }
    }

    public async connectToProxy(proxy: string, userID: string) {
        const formattedProxy = proxy.startsWith('socks5://')
            ? proxy
            : proxy.startsWith('http')
            ? proxy
            : `socks5://${proxy}`;
        const proxyInfo = await this.getProxyIP(formattedProxy);

        if (!proxyInfo) {
            return { needReconnect: false };
        }

        try {
            const agent = formattedProxy.startsWith('http')
                ? new HttpsProxyAgent(formattedProxy)
                : new SocksProxyAgent(formattedProxy);
            const wsURL = `wss://${this.config.wssHost}`;
            const ws = new WebSocket(wsURL, {
                agent,
                headers: {
                    'User-Agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0',
                    Pragma: 'no-cache',
                    'Accept-Language': 'uk-UA,uk;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Cache-Control': 'no-cache',
                    OS: 'Windows',
                    Platform: 'Desktop',
                    Browser: 'Mozilla',
                },
            });

            return new Promise<{ needReconnect: boolean }>((resolve) => {
                ws.on('open', () => {
                    console.log(`Connected to ${proxy}`.cyan);
                    console.log(`Proxy IP Info: ${JSON.stringify(proxyInfo)}`.magenta);
                    this.sendPing(ws, proxyInfo.ip, userID);
                });

                ws.on('message', (message: string) => {
                    const msg = JSON.parse(message) as Message;
                    console.log(`Received message: ${JSON.stringify(msg)}`.blue);

                    if (msg.action === 'AUTH') {
                        const authResponse = {
                            id: msg.id,
                            origin_action: 'AUTH',
                            result: {
                                browser_id: uuidv4(),
                                user_id: userID,
                                user_agent: 'Mozilla/5.0',
                                timestamp: Math.floor(Date.now() / 1000),
                                device_type: 'desktop',
                                version: '4.28.1',
                            },
                        };
                        ws.send(JSON.stringify(authResponse));
                        console.log(
                            `Sent auth response: ${JSON.stringify(authResponse)}`.green
                        );
                    }
                });

                ws.on('close', (code: number, reason: string) => {
                    console.log(
                        `WebSocket closed with code: ${code}, reason: ${reason}`.yellow
                    );
                    resolve({ needReconnect: true });
                });

                ws.on('error', (error: { message: any; }) => {
                    console.error(
                        `WebSocket error on proxy ${proxy}: ${error.message}`.red
                    );
                    resolve({ needReconnect: true });
                });
            });
        } catch (error) {
            console.error(
                `Failed to connect with proxy ${proxy}: ${error.message}`.red
            );
            return { needReconnect: false };
        }
    }

    private sendPing(ws: WebSocket, proxyIP: string, userID: string) {
        const pingInterval = setInterval(() => {
            if (ws.readyState !== WebSocket.OPEN) {
                console.log(`WebSocket closed. Stopping ping for ${proxyIP}`.yellow);
                clearInterval(pingInterval); 
                return;
            }

            const pingMessage = {
                id: uuidv4(),
                version: '1.0.0',
                action: 'PING',
                data: {},
            };
            ws.send(JSON.stringify(pingMessage));
            console.log(
                `Sent ping - IP: ${proxyIP}, Message: ${JSON.stringify(pingMessage)}`
                    .cyan
            );
        }, 26000);

        ws.on('close', () => {
            clearInterval(pingInterval);
        });
    
        ws.on('error', (error) => {
            clearInterval(pingInterval);
        });
    }
}

export default WSocket;
