'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'

export default function FAQsTwo() {
    const faqItems = [
        {
            id: 'item-1',
            question: 'Do my files get uploaded to a server?',
            answer: 'No. All file conversions happen directly inside your browser using local processing. Your files never leave your device, and we do not store or transmit them anywhere.',
        },
        {
            id: 'item-2',
            question: 'Is there a file size limit?',
            answer: 'There are no artificial limits. However, since processing happens in your browser, very large files depend on your device’s RAM and CPU performance.',
        },
        {
            id: 'item-3',
            question: 'What formats are supported?',
            answer: 'Convert-neo supports popular image formats (JPG, PNG, WebP), audio formats (MP3, WAV), and video formats (MP4, WebM). We are continuously expanding support for modern and legacy formats.',
        },
        {
            id: 'item-4',
            question: 'Does it work offline?',
            answer: 'Yes. Once the page is loaded, conversions can work without an active internet connection because processing happens locally in your browser.',
        },
        {
            id: 'item-5',
            question: 'Why is conversion speed different on some devices?',
            answer: 'Since everything runs locally, performance depends on your device’s hardware. Faster CPUs and more RAM will process large video or audio files more quickly.',
        },
    ]

    return (
        <section className="py-16 md:py-24">
            <div className="mx-auto max-w-5xl px-4 md:px-6">
                <div className="mx-auto max-w-xl text-center">
                    <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-muted-foreground mt-4 text-balance">
                        Everything you need to know about how Convert-neo processes your files securely and locally.
                    </p>
                </div>

                <div className="mx-auto mt-12 max-w-xl">
                    <Accordion
                        type="single"
                        collapsible
                        className="bg-card ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0">

                        {faqItems.map((item) => (
                            <AccordionItem
                                key={item.id}
                                value={item.id}
                                className="border-dashed">
                                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-base text-muted-foreground">
                                        {item.answer}
                                    </p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    <p className="text-muted-foreground mt-6 px-8">
                        Still have questions? Reach out to our{' '}
                        <Link
                            href="/contact"
                            className="text-primary font-medium hover:underline">
                            support team
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </section>
    )
}