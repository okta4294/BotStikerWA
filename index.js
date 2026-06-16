const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const axios = require('axios');
const { instagramGetUrl } = require('instagram-url-direct');

// Tambahkan path ffmpeg-static ke system PATH agar bisa dideteksi oleh whatsapp-web.js
process.env.PATH = path.dirname(ffmpegPath) + path.delimiter + process.env.PATH;

const client = new Client({
    authStrategy: new LocalAuth(),
    ffmpegPath: ffmpegPath, // Optional: untuk versi whatsapp-web.js terbaru
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    // Menampilkan QR Code di terminal
    console.log('Scan QR Code ini menggunakan WhatsApp Anda:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log('Bot sudah siap dan berjalan!');
    try {
        // Mengirim notifikasi pesan ke diri sendiri (nomor bot/user)
        const myNumber = client.info.wid._serialized;
        console.log('Mencoba mengirim notifikasi ke nomor:', myNumber);
        await client.sendMessage(myNumber, 'Aktif boloo');
        console.log('Notifikasi berhasil terkirim!');
    } catch (e) {
        console.error('Gagal mengirim notifikasi:', e);
    }
});

// Fungsi pembantu untuk mengekstrak URL dari teks
function extractUrl(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = text.match(urlRegex);
    return match ? match[0] : null;
}

client.on('message', async msg => {
    try {
        const chat = await msg.getChat();
        const text = msg.body.toLowerCase();
        
        const isSticker = text.includes('/sticker') || text.includes('/stiker');
        const isDownload = text.includes('/download') || text.includes('/dl');
        const isMenu = text.includes('/menu') || text.includes('/help');

        if (isMenu) {
            msg.reply(`*MENU BOT STIKER & DOWNLOADER* *Perintah yang tersedia:*

1. */sticker* atau */stiker*
   - Kirim gambar/video dengan caption /sticker.
   - Reply gambar/video dengan /sticker.
   - Kirim link Instagram/X (Twitter) dengan /sticker.

2. */download* atau */dl*
   - Kirim link Instagram/X (Twitter) dengan /download untuk mengunduh video/gambar (tanpa jadi stiker).

3. */menu* atau */help*
   - Menampilkan pesan bantuan ini.

dibuat oleh Gue`);
            return;
        }

        if (isSticker || isDownload) {
            const sendAsSticker = isSticker;

            // 1. Jika pesan berupa gambar/video/gif (termasuk jika dikirim dengan caption /sticker atau /download)
            if (msg.hasMedia) {
                const media = await msg.downloadMedia();
                
                if (media) {
                    console.log('Memproses media...');
                    await chat.sendMessage(media, sendAsSticker ? { 
                        sendMediaAsSticker: true,
                        stickerName: 'Bot Stiker',
                        stickerAuthor: 'MyBot'
                    } : undefined);
                    console.log('Media berhasil dikirim!');
                    return;
                }
            } 
            
            // 2. Jika membalas (reply) pesan yang berisi gambar/video/gif
            else if (msg.hasQuotedMsg) {
                const quotedMsg = await msg.getQuotedMessage();
                if (quotedMsg.hasMedia) {
                    const media = await quotedMsg.downloadMedia();
                    if (media) {
                        console.log('Memproses media yang di-reply...');
                        await chat.sendMessage(media, sendAsSticker ? { 
                            sendMediaAsSticker: true,
                            stickerName: 'Bot Stiker',
                            stickerAuthor: 'MyBot'
                        } : undefined);
                        console.log('Media berhasil dikirim!');
                        return;
                    }
                }
            }
            
            // 3. Jika pesan berisi URL sosmed
            const url = extractUrl(msg.body);
            if (url) {
                console.log('Mendownload dari URL:', url);
                msg.reply('⏳ Sedang mencoba mendownload dan memproses URL. Mohon tunggu sebentar...');
                
                try {
                    let downloadUrl = url;
                    
                    if (url.includes('instagram.com')) {
                        const igRes = await instagramGetUrl(url);
                        if (igRes && igRes.url_list && igRes.url_list.length > 0) {
                            for (const mediaUrl of igRes.url_list) {
                                try {
                                    const mediaResponse = await axios.get(mediaUrl, { 
                                        responseType: 'arraybuffer',
                                        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36' }
                                    });
                                    const mimetype = mediaResponse.headers['content-type'];
                                    const data = Buffer.from(mediaResponse.data, 'binary').toString('base64');
                                    const media = new MessageMedia(mimetype, data, 'media');
                                    await chat.sendMessage(media, sendAsSticker ? { 
                                        sendMediaAsSticker: true,
                                        stickerName: 'Bot Stiker',
                                        stickerAuthor: 'MyBot'
                                    } : undefined);
                                } catch (e) {
                                    console.error('Gagal memproses salah satu media IG:', e.message);
                                }
                            }
                            return; // Selesai memproses semua gambar IG
                        } else {
                            throw new Error('Tidak dapat menemukan media di URL Instagram tersebut.');
                        }
                    } else if (url.includes('x.com') || url.includes('twitter.com')) {
                        let mediaUrlsToDownload = [];
                        
                        // Konfigurasi agen super stabil untuk mengatasi "EPROTO" dan "fetch failed" di Node.js Windows
                        const https = require('https');
                        const crypto = require('crypto');
                        const customAgent = new https.Agent({
                            rejectUnauthorized: false,
                            family: 4, // Paksa menggunakan IPv4 agar anti 'fetch failed'
                            secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT // Bypass error EPROTO / SSLv3 Handshake dari Cloudflare
                        });
                        const axiosConfig = {
                            httpsAgent: customAgent,
                            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/115.0.0.0 Safari/537.36' }
                        };
                        
                        try {
                            // Coba vxtwitter
                            const cleanUrl = url.split('?')[0];
                            // Ganti hanya hostname, bukan seluruh string (fix bug double-replace)
                            const tweetId = cleanUrl.split('/').pop();
                            const apiUrl = `https://api.vxtwitter.com/i/status/${tweetId}`;
                            const response = await axios.get(apiUrl, axiosConfig);
                            if (response.data && response.data.mediaURLs && response.data.mediaURLs.length > 0) {
                                mediaUrlsToDownload = response.data.mediaURLs;
                            } else {
                                throw new Error('vxtwitter: media tidak ditemukan');
                            }
                        } catch (err1) {
                            console.log('vxtwitter gagal, mencoba fxtwitter...', err1.message);
                            try {
                                const cleanUrl = url.split('?')[0];
                                const tweetId = cleanUrl.split('/').pop();
                                // Gunakan URL yang dibangun manual agar tidak ada bug double-replace
                                const apiUrl2 = `https://api.fxtwitter.com/i/status/${tweetId}`;
                                const response2 = await axios.get(apiUrl2, axiosConfig);
                                if (response2.data && response2.data.tweet && response2.data.tweet.media && response2.data.tweet.media.all) {
                                    mediaUrlsToDownload = response2.data.tweet.media.all.map(m => m.url);
                                }
                            } catch (err2) {
                                console.log('fxtwitter gagal, mencoba btch-downloader...', err2.message);
                                try {
                                    // Fallback ke btch-downloader (library lokal, tidak perlu SSL)
                                    const { twitter: btchTwitter } = require('btch-downloader');
                                    const btchRes = await btchTwitter(url);
                                    if (btchRes && btchRes.url && btchRes.url.length > 0) {
                                        mediaUrlsToDownload = btchRes.url.filter(u => u.url).map(u => u.url);
                                    }
                                } catch (err3) {
                                    throw new Error('Semua metode Twitter gagal: ' + err3.message);
                                }
                            }
                        }
                        
                        if (mediaUrlsToDownload.length > 0) {
                            for (const mediaUrl of mediaUrlsToDownload) {
                                try {
                                    const mediaResponse = await axios.get(mediaUrl, { 
                                        responseType: 'arraybuffer',
                                        ...axiosConfig
                                    });
                                    const mimetype = mediaResponse.headers['content-type'] || 'video/mp4';
                                    const data = Buffer.from(mediaResponse.data, 'binary').toString('base64');
                                    
                                    const media = new MessageMedia(mimetype, data, 'media');
                                    await chat.sendMessage(media, sendAsSticker ? { 
                                        sendMediaAsSticker: true,
                                        stickerName: 'Bot Stiker',
                                        stickerAuthor: 'MyBot'
                                    } : undefined);
                                } catch (e) {
                                    console.error('Gagal mengambil media Twitter:', e.message);
                                }
                            }
                            return;
                        } else {
                            throw new Error('Tidak dapat menemukan media di URL X/Twitter tersebut.');
                        }
                    }

                    // Ambil buffer dari URL (jika URL langsung / fallback)
                    const https = require('https');
                    const crypto = require('crypto');
                    const mediaResponse = await axios.get(downloadUrl, { 
                        responseType: 'arraybuffer',
                        httpsAgent: new https.Agent({ 
                            rejectUnauthorized: false, 
                            family: 4,
                            secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT
                        }),
                        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/115.0.0.0 Safari/537.36' }
                    });
                    const mimetype = mediaResponse.headers['content-type'];
                    const data = Buffer.from(mediaResponse.data, 'binary').toString('base64');
                    
                    const media = new MessageMedia(mimetype, data, 'media');
                    
                    await chat.sendMessage(media, sendAsSticker ? { 
                        sendMediaAsSticker: true,
                        stickerName: 'Bot Stiker',
                        stickerAuthor: 'MyBot'
                    } : undefined);
                    
                } catch (err) {
                    console.error('Gagal memproses URL:', err.message);
                    msg.reply('❌ Maaf, gagal mendownload atau memproses URL tersebut. Pastikan URL publik (tidak di-private).');
                }
                return;
            }
            
            // Jika tidak ada media atau URL
            msg.reply('Kirim gambar/video/URL, Gambar Mbott matane ki lo, /menu ben paham \n Falah akbar kontol!!');
        }
    } catch (error) {
        console.error('Error handling message:', error);
    }
});

client.initialize();
