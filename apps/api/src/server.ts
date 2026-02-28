import 'dotenv/config';
import { createApp } from './app';
import { env } from './config/env';

const app = createApp();
app.listen(env.PORT, () => {
  console.log(`Louharya API running on http://localhost:${env.PORT}`);
});
