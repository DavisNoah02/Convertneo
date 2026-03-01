import { Marquee } from "@/components/ui/marquee"

const items = [
  {
    name: "Hamisi Riz",
    title: "Content Creator",
    image:
      "https://cdn.badtz-ui.com/images/components/avatar-proof/avatar-4.webp",
    body: "Convert-neo lets me convert large video files instantly without uploading anything. The privacy-first approach is a game changer.",
  },
  {
    name: "Ken Tom",
    title: "Frontend Engineer",
    image:
      "https://cdn.badtz-ui.com/images/components/avatar-proof/avatar-1.webp",
    body: "Everything runs locally in the browser. No server lag, no file limits, no nonsense. It just works.",
  },
  {
    name: "Elvis Warutumo",
    title: "Digital Marketer",
    image:
      "https://cdn.badtz-ui.com/images/components/avatar-proof/avatar-3.webp",
    body: "I use Convert-neo daily for image and audio conversions. It’s fast, clean, and doesn’t bombard me with ads.",
  },
  {
    name: "Sarah Njeri",
    title: "Kenyan Filmmaker",
    image:
      "https://cdn.badtz-ui.com/images/components/avatar-proof/avatar-2.webp",
    body: "No uploads. No watermarks. No account required. That alone makes Convert-neo better than most tools out there.",
  },
]

function TestimonialCard({ item }: { item: (typeof items)[number] }) {
  return (
    <div className="relative flex h-full w-[20rem] flex-col items-start justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-900">
      <div className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
        {item.body}
      </div>
      <div className="mt-auto flex items-center gap-4">
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <div className="text-sm font-medium text-neutral-950 dark:text-neutral-50">
            {item.name}
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {item.title}
          </div>
        </div>
      </div>
    </div>
  )
}

export function MarqueeTestimonial() {
  return (
    <section className="flex flex-col items-center py-16">
      {/* ===== Title Section ===== */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Built for privacy. Trusted by creators.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Real feedback from people using Convert-neo every day.
        </p>
      </div>

      {/* ===== Marquee Section ===== */}
      <div className="relative max-w-[900px] overflow-hidden">
        <div className="from-background absolute inset-y-0 left-0 z-10 w-30 bg-gradient-to-r to-transparent" />
        <div className="from-background absolute inset-y-0 right-0 z-10 w-30 bg-gradient-to-l to-transparent" />

        <Marquee className="py-2" direction="left">
          {[...items, ...items].map((item, index) => (
            <TestimonialCard key={index} item={item} />
          ))}
        </Marquee>

        <Marquee className="py-2" direction="right">
          {[...items, ...items].map((item, index) => (
            <TestimonialCard key={index} item={item} />
          ))}
        </Marquee>
      </div>
    </section>
  )
}