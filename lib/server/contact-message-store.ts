import { prisma } from "@/lib/server/db";

type ContactMessageRecord = {
  name: string;
  email: string;
  message: string;
  ipAddress?: string;
  userAgent?: string;
};

export async function saveContactMessage(record: ContactMessageRecord): Promise<void> {
  await prisma.contactMessage.create({
    data: {
      name: record.name,
      email: record.email,
      message: record.message,
      ipAddress: record.ipAddress,
      userAgent: record.userAgent,
    },
  });
}
