import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed categories based on Louharya's LTT method themes
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Self-Frequency' },
      update: {},
      create: {
        name: 'Self-Frequency',
        description: 'Connect with your inner source frequency — your authentic Self',
        icon: 'radio',
        color: '#8B7CF6',
        order: 1,
      },
    }),
    prisma.category.upsert({
      where: { name: 'Inner Alignment' },
      update: {},
      create: {
        name: 'Inner Alignment',
        description: 'Bring different parts of yourself into alignment with a shared truth',
        icon: 'align-center',
        color: '#6EE7B7',
        order: 2,
      },
    }),
    prisma.category.upsert({
      where: { name: 'World of Causes' },
      update: {},
      create: {
        name: 'World of Causes',
        description: 'Explore root-level origins to understand the world of results',
        icon: 'layers',
        color: '#FCA5A5',
        order: 3,
      },
    }),
    prisma.category.upsert({
      where: { name: 'Consciousness Expansion' },
      update: {},
      create: {
        name: 'Consciousness Expansion',
        description: 'Expand awareness beyond the physical into higher dimensions',
        icon: 'aperture',
        color: '#93C5FD',
        order: 4,
      },
    }),
    prisma.category.upsert({
      where: { name: 'Energetic Healing' },
      update: {},
      create: {
        name: 'Energetic Healing',
        description: 'Work with your energetic field to clear residues and restore vitality',
        icon: 'zap',
        color: '#FCD34D',
        order: 5,
      },
    }),
  ]);

  // Seed sample meditations (placeholder content — to be replaced with official content)
  await prisma.meditation.upsert({
    where: { id: 'sample-1' },
    update: {},
    create: {
      id: 'sample-1',
      title: 'Returning to Your Source Frequency',
      description:
        'A foundational practice for reconnecting with your authentic Self, free from distractions and external noise.',
      duration: 600, // 10 minutes
      categoryId: categories[0].id,
      audioUrl: null,
      guideSteps: [
        { time: 0, text: 'Find a comfortable seated position. Close your eyes gently.' },
        { time: 15, text: 'Take three slow, deep breaths. With each exhale, release tension from your body.' },
        { time: 45, text: 'Bring your awareness inward. Notice the space within your chest.' },
        { time: 90, text: 'Imagine a warm, steady light at your center — this is your Source Frequency.' },
        { time: 150, text: 'With each breath, allow this light to grow stronger and more defined.' },
        { time: 240, text: 'Notice how this frequency feels. This is your authentic melody — unique to you.' },
        { time: 360, text: 'Rest in this awareness. You are reconnecting with who you truly are.' },
        { time: 480, text: 'Slowly, begin to bring this awareness back with you into your day.' },
        { time: 570, text: 'Gently open your eyes when you feel ready.' },
      ],
      tags: ['beginner', 'self-awareness', 'grounding'],
      level: 'BEGINNER',
      isPublished: true,
      order: 1,
    },
  });

  await prisma.meditation.upsert({
    where: { id: 'sample-2' },
    update: {},
    create: {
      id: 'sample-2',
      title: 'Aligning the Inner Parts',
      description:
        'A practice for bringing the different aspects of yourself — body, mind, and spirit — into harmonious alignment.',
      duration: 900, // 15 minutes
      categoryId: categories[1].id,
      audioUrl: null,
      guideSteps: [
        { time: 0, text: 'Sit comfortably and close your eyes. Take a moment to arrive here.' },
        { time: 20, text: 'Begin to observe yourself: your physical body, your thoughts, your feelings.' },
        { time: 60, text: 'Notice that you are composed of many parts. Welcome each one without judgment.' },
        { time: 120, text: 'Imagine each part as a musician in an orchestra, waiting to play together.' },
        { time: 210, text: 'Bring attention to any tension or discord between your parts. Just observe.' },
        { time: 300, text: 'Now invite each part to align with a shared truth: your deepest intention.' },
        { time: 420, text: 'Feel the harmony that emerges when your parts move in the same direction.' },
        { time: 600, text: 'This alignment is your natural state. Rest here and let it deepen.' },
        { time: 780, text: 'Carry this harmony with you as you gently return to the present moment.' },
        { time: 870, text: 'Take a deep breath and slowly open your eyes.' },
      ],
      tags: ['alignment', 'harmony', 'integration'],
      level: 'BEGINNER',
      isPublished: true,
      order: 2,
    },
  });

  await prisma.meditation.upsert({
    where: { id: 'sample-3' },
    update: {},
    create: {
      id: 'sample-3',
      title: 'Exploring the World of Causes',
      description:
        'A deeper practice to investigate the root causes beneath your current experiences and patterns.',
      duration: 1200, // 20 minutes
      categoryId: categories[2].id,
      audioUrl: null,
      guideSteps: [
        { time: 0, text: 'Settle into stillness. Let your breath slow and your mind quieten.' },
        { time: 30, text: 'Bring to mind a current challenge or pattern in your life — just observe it.' },
        { time: 90, text: 'Rather than trying to fix it, allow yourself to become curious about it.' },
        { time: 180, text: 'Ask inwardly: What is the root of this experience? Let the question rest open.' },
        { time: 300, text: 'Observe what arises — images, feelings, memories — without attachment.' },
        { time: 480, text: 'Notice any recurring themes. These point toward your World of Causes.' },
        { time: 660, text: 'Acknowledge what you have discovered with compassion and openness.' },
        { time: 840, text: 'Understand that awareness of the cause is itself the beginning of transformation.' },
        { time: 1080, text: 'Begin to let go of the exploration and return to your breath.' },
        { time: 1170, text: 'Slowly return to the room and open your eyes when ready.' },
      ],
      tags: ['deep-work', 'self-inquiry', 'transformation'],
      level: 'INTERMEDIATE',
      isPublished: true,
      order: 3,
    },
  });

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
