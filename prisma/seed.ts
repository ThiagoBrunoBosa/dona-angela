import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_SEED_EMAIL ?? "admin@donaangela.com.br";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD ?? "changeme123";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: Role.ADMIN, passwordHash },
    create: {
      email: adminEmail,
      name: "Administrador",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  const userPassword = await bcrypt.hash("usuario123", 12);
  await prisma.user.upsert({
    where: { email: "usuario@teste.com" },
    update: {},
    create: {
      email: "usuario@teste.com",
      name: "Usuário Teste",
      passwordHash: userPassword,
      role: Role.USER,
    },
  });

  const recipes = [
    {
      slug: "bolo-de-fuba-da-familia",
      title: "Bolo de Fubá da Família",
      category: "Bolos",
      prepTimeMinutes: 50,
      defaultYield: 8,
      historyHtml:
        "<p>Esta receita atravessou gerações na nossa família. O segredo está no fubá moído fino e no leite morno que realça o aroma doce e reconfortante do bolo.</p>",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      imageUrl:
        "https://images.unsplash.com/photo-1713602754357-ca94ed259196?w=800",
      published: true,
      ingredients: [
        { quantity: "3", unit: "xícaras", name: "fubá" },
        { quantity: "2", unit: "xícaras", name: "açúcar" },
        { quantity: "3", unit: "", name: "ovos" },
        { quantity: "1", unit: "xícara", name: "leite" },
        { quantity: "1/2", unit: "xícara", name: "óleo" },
      ],
      steps: [
        { text: "Pré-aqueça o forno a 180°C e unte uma forma." },
        { text: "Bata os ovos com o açúcar até ficar claro." },
        { text: "Adicione o leite, óleo e fubá. Misture bem." },
        { text: "Despeje na forma e asse por 40 minutos." },
      ],
      affiliates: [
        {
          name: "Forma Redonda 24cm",
          url: "https://www.amazon.com.br/",
        },
      ],
    },
    {
      slug: "frango-assado-ervas",
      title: "Frango Assado com Ervas",
      category: "Pratos Principais",
      prepTimeMinutes: 90,
      defaultYield: 6,
      historyHtml:
        "<p>Um prato de domingo que reúne a família à mesa. As ervas frescas transformam um frango simples em uma refeição memorável.</p>",
      imageUrl:
        "https://images.unsplash.com/photo-1594221708779-94832f4320d1?w=800",
      published: true,
      ingredients: [
        { quantity: "1", unit: "", name: "frango inteiro" },
        { quantity: "4", unit: "dentes", name: "alho" },
        { quantity: "2", unit: "colheres", name: "manteiga" },
        { quantity: "1", unit: "maço", name: "salsinha" },
        { quantity: "1", unit: "colher", name: "sal" },
      ],
      steps: [
        { text: "Tempere o frango com alho, sal e ervas." },
        { text: "Pincele com manteiga derretida." },
        { text: "Asse a 200°C por 1h30, regando a cada 20 minutos." },
      ],
      affiliates: [],
    },
    {
      slug: "mousse-de-chocolate",
      title: "Mousse de Chocolate",
      category: "Sobremesas",
      prepTimeMinutes: 20,
      defaultYield: 4,
      historyHtml:
        "<p>Sobremesa clássica com textura aveludada. Ideal para encerrar um almoço especial com elegância.</p>",
      imageUrl:
        "https://images.unsplash.com/photo-1744988870979-43fcbfdd0804?w=800",
      published: true,
      ingredients: [
        { quantity: "200", unit: "g", name: "chocolate meio amargo" },
        { quantity: "3", unit: "", name: "ovos" },
        { quantity: "1", unit: "lata", name: "creme de leite" },
        { quantity: "2", unit: "colheres", name: "açúcar" },
      ],
      steps: [
        { text: "Derreta o chocolate em banho-maria." },
        { text: "Separe as claras e bata em neve com açúcar." },
        { text: "Misture gemas, creme de leite e chocolate." },
        { text: "Incorpore as claras e leve à geladeira por 4h." },
      ],
      affiliates: [],
    },
  ];

  for (const r of recipes) {
    await prisma.recipe.upsert({
      where: { slug: r.slug },
      update: {
        imageUrl: r.imageUrl,
        title: r.title,
        category: r.category,
        prepTimeMinutes: r.prepTimeMinutes,
        defaultYield: r.defaultYield,
        historyHtml: r.historyHtml,
        videoUrl: r.videoUrl ?? null,
        published: r.published,
      },
      create: {
        slug: r.slug,
        title: r.title,
        category: r.category,
        prepTimeMinutes: r.prepTimeMinutes,
        defaultYield: r.defaultYield,
        historyHtml: r.historyHtml,
        videoUrl: r.videoUrl ?? null,
        imageUrl: r.imageUrl,
        published: r.published,
        ingredients: {
          create: r.ingredients.map((ing, i) => ({
            quantity: ing.quantity,
            unit: ing.unit,
            name: ing.name,
            sortOrder: i,
          })),
        },
        steps: {
          create: r.steps.map((step, i) => ({
            text: step.text,
            sortOrder: i,
          })),
        },
        affiliates: {
          create: r.affiliates.map((aff, i) => ({
            name: aff.name,
            url: aff.url,
            sortOrder: i,
          })),
        },
      },
    });
  }

  console.log("Seed OK — admin:", admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
