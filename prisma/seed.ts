import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Eventwise AI database seeding...');

  // 1. Create or get default demo user
  const passwordHash = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@eventwise.ai' },
    update: {},
    create: {
      email: 'demo@eventwise.ai',
      passwordHash,
      name: 'Vikram Sharma',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      systemRole: 'ADMIN',
    },
  });
  console.log(`👤 Created Demo User: ${user.name} (${user.email})`);

  // 2. Create default workspace
  const workspace = await prisma.workspace.upsert({
    where: { slug: 'sharma-celebrations' },
    update: {},
    create: {
      name: 'Sharma Celebrations',
      slug: 'sharma-celebrations',
      ownerId: user.id,
      currency: 'INR',
      locale: 'en-IN',
      timezone: 'Asia/Kolkata',
      members: {
        create: {
          userId: user.id,
          role: 'OWNER',
        },
      },
    },
  });
  console.log(`🏢 Created Workspace: ${workspace.name}`);

  // 3. Create Event 1: Wedding in Udaipur
  const weddingDate = new Date();
  weddingDate.setDate(weddingDate.getDate() + 45); // 45 days in future

  const wedding = await prisma.event.upsert({
    where: {
      workspaceId_slug: {
        workspaceId: workspace.id,
        slug: 'ananya-rohan-wedding',
      },
    },
    update: {},
    create: {
      workspaceId: workspace.id,
      creatorId: user.id,
      title: "Ananya & Rohan's Modern Garden Wedding",
      slug: 'ananya-rohan-wedding',
      type: 'WEDDING',
      status: 'PLANNING',
      startDate: weddingDate,
      location: 'Udaipur, Rajasthan',
      guestCount: 180,
      budgetCeiling: 1500000, // 15 Lakhs INR
      currency: 'INR',
      theme: 'Royal Garden & Warm Ambient Lights',
      formality: 'Formal / Traditional Festive',
      dietaryNotes: 'Vegetarian and Jain counters required. Live Rajasthani chaat station.',
      notes: 'SAMPLE SEED DATA: Sunset pheras by the lake, followed by dinner and acoustic musical performance.',
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    },
  });

  // Categories for Wedding
  const weddingCategories = [
    { name: 'Heritage Venue & Setup', allocatedAmount: 375000, color: '#6366f1' },
    { name: 'Catering & Beverages', allocatedAmount: 480000, color: '#ec4899' },
    { name: 'Decor, Mandap & Lights', allocatedAmount: 225000, color: '#f59e0b' },
    { name: 'Candid Photography & Film', allocatedAmount: 150000, color: '#10b981' },
    { name: 'Music & Sangeet Setup', allocatedAmount: 90000, color: '#3b82f6' },
    { name: 'Invites & Guest Favors', allocatedAmount: 60000, color: '#8b5cf6' },
    { name: 'Contingency Reserve', allocatedAmount: 120000, color: '#64748b' },
  ];

  for (const cat of weddingCategories) {
    const createdCat = await prisma.budgetCategory.upsert({
      where: {
        eventId_name: {
          eventId: wedding.id,
          name: cat.name,
        },
      },
      update: {},
      create: {
        eventId: wedding.id,
        name: cat.name,
        allocatedAmount: cat.allocatedAmount,
        color: cat.color,
      },
    });

    // Add some sample paid and pending expenses
    if (cat.name === 'Heritage Venue & Setup') {
      await prisma.expense.create({
        data: {
          eventId: wedding.id,
          categoryId: createdCat.id,
          title: 'Advance Deposit for Lake Palace Lawn',
          amount: 150000,
          status: 'PAID',
          paymentDate: new Date(),
          isEstimated: false,
        },
      });
      await prisma.expense.create({
        data: {
          eventId: wedding.id,
          categoryId: createdCat.id,
          title: 'Remaining Venue Settlement',
          amount: 225000,
          status: 'PENDING',
          paymentDate: weddingDate,
          isEstimated: false,
        },
      });
    } else if (cat.name === 'Catering & Beverages') {
      await prisma.expense.create({
        data: {
          eventId: wedding.id,
          categoryId: createdCat.id,
          title: 'Tasting & Menu Booking Advance',
          amount: 100000,
          status: 'PAID',
          isEstimated: false,
        },
      });
    }
  }

  // Tasks for Wedding
  const weddingTasks = [
    { title: 'Lock Udaipur venue booking contract and verify curfew timings', status: 'COMPLETED', priority: 'HIGH', category: 'Venue', leadDays: 40 },
    { title: 'Finalize 4-course dinner menu and Jain catering counts', status: 'IN_PROGRESS', priority: 'HIGH', category: 'Catering', leadDays: 30 },
    { title: 'Confirm photographer shot list & golden-hour sunset timing', status: 'TODO', priority: 'MEDIUM', category: 'Media', leadDays: 20 },
    { title: 'Mail out digital invitations and tracking links', status: 'COMPLETED', priority: 'HIGH', category: 'Invitations', leadDays: 25 },
    { title: 'Review floral mandap 3D render with decor designer', status: 'TODO', priority: 'MEDIUM', category: 'Decor', leadDays: 15 },
  ];

  for (const [idx, task] of weddingTasks.entries()) {
    const dueDate = new Date(weddingDate);
    dueDate.setDate(dueDate.getDate() - task.leadDays);
    await prisma.task.create({
      data: {
        eventId: wedding.id,
        title: task.title,
        status: task.status,
        priority: task.priority,
        category: task.category,
        dueDate,
        order: idx,
      },
    });
  }

  // Vendors for Wedding
  const weddingVendors = [
    { name: 'Udaivilas Courtyard & Lawns', category: 'Venue', quotedAmount: 375000, bookingStatus: 'BOOKED', paymentStatus: 'PARTIALLY_PAID' },
    { name: 'Royal Mewar Gourmet Catering', category: 'Catering', quotedAmount: 480000, bookingStatus: 'SHORTLISTED', paymentStatus: 'DEPOSIT_DUE' },
    { name: 'Lumiere Studios Candid Films', category: 'Photography', quotedAmount: 150000, bookingStatus: 'CONTACTED', paymentStatus: 'NOT_DUE' },
    { name: 'Vibrant Petals Florals & Decor', category: 'Decor', quotedAmount: 220000, bookingStatus: 'QUOTE_RECEIVED', paymentStatus: 'NOT_DUE' },
  ];

  for (const v of weddingVendors) {
    await prisma.vendor.create({
      data: {
        eventId: wedding.id,
        workspaceId: workspace.id,
        name: v.name,
        category: v.category,
        quotedAmount: v.quotedAmount,
        bookingStatus: v.bookingStatus,
        paymentStatus: v.paymentStatus,
      },
    });
  }

  // Guests for Wedding
  const sampleGuests = [
    { name: 'Rajesh & Meena Sharma', group: 'FAMILY', rsvpStatus: 'ATTENDING', plusOnes: 1 },
    { name: 'Kavita Verma', group: 'FRIENDS', rsvpStatus: 'ATTENDING', plusOnes: 0 },
    { name: 'Aditya Birla', group: 'VIP', rsvpStatus: 'TENTATIVE', plusOnes: 1 },
    { name: 'Sunil Gupta', group: 'FAMILY', rsvpStatus: 'NO_REPLY', plusOnes: 2 },
  ];

  for (const g of sampleGuests) {
    await prisma.guest.create({
      data: {
        eventId: wedding.id,
        name: g.name,
        group: g.group,
        rsvpStatus: g.rsvpStatus,
        plusOnes: g.plusOnes,
      },
    });
  }

  // Ideas for Wedding
  await prisma.idea.create({
    data: {
      eventId: wedding.id,
      title: 'Floating Lake Diyas at Sunset',
      category: 'Decor',
      description: 'Guests release eco-friendly earthen lamps into the lake waters as twilight sets in.',
      impact: 'High',
      status: 'ACCEPTED',
    },
  });

  // 4. Create Event 2: Birthday in Bengaluru
  const birthdayDate = new Date();
  birthdayDate.setDate(birthdayDate.getDate() + 18);
  const birthday = await prisma.event.upsert({
    where: {
      workspaceId_slug: {
        workspaceId: workspace.id,
        slug: 'aarav-superhero-birthday',
      },
    },
    update: {},
    create: {
      workspaceId: workspace.id,
      creatorId: user.id,
      title: "Aarav's 10th Superhero Birthday Bash",
      slug: 'aarav-superhero-birthday',
      type: 'BIRTHDAY',
      status: 'PLANNING',
      startDate: birthdayDate,
      location: 'Indiranagar, Bengaluru',
      guestCount: 35,
      budgetCeiling: 75000,
      currency: 'INR',
      theme: 'Retro Comic Book Heroes',
      formality: 'Casual Fun',
      notes: 'SAMPLE SEED DATA: 35 kids and parents. Superhero obstacle course, custom comic cake.',
    },
  });

  await prisma.budgetCategory.create({
    data: {
      eventId: birthday.id,
      name: 'Clubhouse Space Rental',
      allocatedAmount: 18000,
      color: '#6366f1',
    },
  });
  await prisma.budgetCategory.create({
    data: {
      eventId: birthday.id,
      name: 'Superhero Cake & Snacks',
      allocatedAmount: 28000,
      color: '#ec4899',
    },
  });

  // 5. Create Event 3: Community Summit in Indore
  const communityDate = new Date();
  communityDate.setDate(communityDate.getDate() + 35);
  await prisma.event.upsert({
    where: {
      workspaceId_slug: {
        workspaceId: workspace.id,
        slug: 'indore-ai-community-summit',
      },
    },
    update: {},
    create: {
      workspaceId: workspace.id,
      creatorId: user.id,
      title: 'Indore Open Source & AI Community Summit',
      slug: 'indore-ai-community-summit',
      type: 'COMMUNITY',
      status: 'PLANNING',
      startDate: communityDate,
      location: 'Brilliant Convention Centre, Indore',
      guestCount: 200,
      budgetCeiling: 250000,
      currency: 'INR',
      theme: 'Building the Future with Open Intelligence',
      formality: 'Tech Casual',
      notes: 'SAMPLE SEED DATA: 200 developers, 6 keynote sessions, and a sponsor expo.',
    },
  });

  console.log('✅ Seed completed successfully with 3 rich demo events!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
