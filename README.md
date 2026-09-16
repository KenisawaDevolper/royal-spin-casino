# ROYAL SPIN Casino - Listo para Vercel

Casino demo completo con 6 juegos, sin backend.

## Deploy en Vercel (30 segundos)
1. Ve a https://vercel.com -> Sign Up (con GitHub)
2. Add New Project -> Upload -> Arrastra la carpeta `casino`
3. Deploy -> Te da URL `https://tu-casino.vercel.app`

O con CLI:
```
npm i -g vercel
vercel --prod
```

## Juegos incluidos
- 🎰 Slots 5 rodillos + Jackpot progresivo
- 🎡 Ruleta Europea x14
- 🃏 Blackjack con doblar
- 🚀 Crash (multiplicador)
- 💣 Mines (5x5)
- 🎲 Dados

Todo guarda en localStorage (saldo, historial, usuario).
Para backend real conectar Supabase/Firebase.
