import * as ftp from "basic-ftp";

// FTP 자격 증명은 .env 파일에서 process.env로 불러옵니다.
// 실행: npm run deploy (= node --env-file=.env deploy.js)
const config = {
    user: process.env.FTP_USER,
    password: process.env.FTP_PASS,
    host: "gripteksolusi.com",
    port: 21,
    localRoot: process.cwd() + "/dist",
    // 메인 cPanel 계정(예: gria4449)의 public_html이 gripteksolusi.com 문서 루트입니다.
    // 로그인 홈 기준 상대경로로 두어 계정 chroot 여부와 무관하게 동작하도록 합니다.
    remoteRoot: "public_html",
};

async function deploy() {
    const client = new ftp.Client(30000);
    client.ftp.verbose = false;
    try {
        await client.access({
            host: config.host,
            port: config.port,
            user: config.user,
            password: config.password,
            // Pure-FTPd는 명시적 TLS를 지원합니다. 서버 인증서가 self-signed일 수 있어 검증은 완화합니다.
            secure: true,
            secureOptions: { rejectUnauthorized: false },
        });
        await client.ensureDir(config.remoteRoot);
        // 원격 기존 파일은 삭제하지 않고 덮어쓰기만 합니다(원래 deleteRemote:false 동작 유지).
        await client.uploadFromDir(config.localRoot);
        console.log("배포 완료");
    } catch (err) {
        console.error("배포 실패:", err);
        process.exitCode = 1;
    } finally {
        client.close();
    }
}

deploy();
