import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const minPrice = parseFloat(searchParams.get('minPrice') || '0');
  const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999');
  const category = searchParams.get('category');

  const products = await prisma.product.findMany({
    where: {
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
      ...(category && { category }),
    },
  });

  return Response.json(products);
}
