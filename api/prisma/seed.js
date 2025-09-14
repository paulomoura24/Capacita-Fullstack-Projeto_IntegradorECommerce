import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);
  const pass = await bcrypt.hash('123456', salt);

  const [admin, vendor, client] = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: { name: 'Admin', email: 'admin@example.com', password: pass, role: 'ADMIN' }
    }),
    prisma.user.upsert({
      where: { email: 'vendedor@example.com' },
      update: {},
      create: { name: 'Vendedor', email: 'vendedor@example.com', password: pass, role: 'VENDOR' }
    }),
    prisma.user.upsert({
      where: { email: 'cliente@example.com' },
      update: {},
      create: { name: 'Cliente', email: 'cliente@example.com', password: pass, role: 'CLIENT' }
    })
  ]);

  console.log({ admin: admin.email, vendor: vendor.email, client: client.email });

  const png1x1 = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAuMB9o3xq2sAAAAASUVORK5CYII=',
    'base64'
  );

  await prisma.product.create({
    data: {
      title: 'Relógio XW9 Pro',
      description: 'Smartwatch premium com tela AMOLED e vários recursos.',
      price: 499.90,
      stock: 25,
      image: png1x1,
      imageMime: 'image/png',
      imageName: 'pixel.png',
      ownerId: vendor.id
    }
  });

  console.log('Seed concluído.');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
