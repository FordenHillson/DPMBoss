# DPMBoss

เว็บคำนวณ Required DPM ตามสัดส่วนเค้กสำหรับบอส (Material Design 3 / MUI)

## ใช้ท้องถิ่น

```bash
npm install
npm run dev
```

## ทดสอบ / บิลด์

```bash
npm test
npm run build
```

## Deploy

Push ไป `main` แล้ว GitHub Actions จะ publish ไป GitHub Pages  
URL: https://fordenhillson.github.io/DPMBoss/

## สูตร

`Required DPM = (Boss HP × Share%) ÷ effectiveMinutes`  
`effectiveMinutes = timeOverride ของผู้เล่น หรือ Clear Time ของปาร์ตี้`
