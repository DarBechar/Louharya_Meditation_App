import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: 'Consciousness',    domain: 'consciousness',    description: 'Expand awareness and perception of reality',    iconName: 'eye-outline',     color: '#9B8EC4', sortOrder: 1 },
  { name: 'Transformation',   domain: 'transformation',   description: 'Address root causes of patterns',               iconName: 'flame-outline',   color: '#C47A5A', sortOrder: 2 },
  { name: 'Self-Frequency',   domain: 'self-frequency',   description: 'Return to your natural energetic state',        iconName: 'radio-outline',   color: '#6AABBB', sortOrder: 3 },
  { name: 'Resilience',       domain: 'resilience',       description: 'Build emotional and mental strength',           iconName: 'shield-outline',  color: '#8BAF96', sortOrder: 4 },
  { name: 'Inner Connection', domain: 'inner-connection', description: 'Access your authentic inner voice',             iconName: 'heart-outline',   color: '#D4889A', sortOrder: 5 },
  { name: 'Integration',      domain: 'integration',      description: 'Ground insights into daily life',               iconName: 'leaf-outline',    color: '#C9A96E', sortOrder: 6 },
];

const PLACEHOLDER_STEPS = [
  { order: 1, durationSeconds: 60,  title: 'Arrive',  instruction: 'Find a comfortable position. Close your eyes. Take three deep, slow breaths, letting each exhale release the day behind you.', breathingCue: 'natural' },
  { order: 2, durationSeconds: 120, title: 'Ground',  instruction: 'Feel the weight of your body. Notice the support beneath you. You are safe. You are held. Breathe naturally.', breathingCue: 'natural' },
  { order: 3, durationSeconds: 180, title: 'Expand',  instruction: 'Imagine your awareness gently expanding outward from your heart center. Like rings of light, it moves through your body, then into the space around you.', breathingCue: 'inhale' },
  { order: 4, durationSeconds: 120, title: 'Receive', instruction: 'Simply rest in this expanded state. Allow insights, feelings, or stillness to arise without chasing or pushing away. You are whole.', breathingCue: 'natural' },
  { order: 5, durationSeconds: 60,  title: 'Return',  instruction: 'Gently bring your awareness back to your breath, to this room. When ready, softly open your eyes. Carry this stillness with you.', breathingCue: 'exhale' },
];

async function main() {
  for (const cat of CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });

    await prisma.meditation.upsert({
      where: { id: `placeholder-${cat.domain}` },
      update: {},
      create: {
        id: `placeholder-${cat.domain}`,
        title: `${cat.name} Introduction`,
        subtitle: 'A first step on the path',
        description: cat.description,
        durationMinutes: 9,
        difficulty: 'beginner',
        format: 'guided_steps',
        isFeatured: cat.sortOrder <= 3,
        isPublished: true,
        categoryId: category.id,
        tags: [cat.domain, 'beginner', 'introduction'],
        content: { steps: PLACEHOLDER_STEPS, introText: `Welcome to your ${cat.name} practice.` },
      },
    });
  }
  console.log('Seed complete — 6 categories and 6 placeholder meditations created.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
