'use client'

import { useState } from 'react'
import { useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { TimePicker } from '@/components/ui/time-picker'
import { format, isBefore, startOfDay, parseISO } from 'date-fns'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { quicksand, dancingScript } from '@/lib/fonts'
import { db, auth } from '@/lib/firebase'
import { addDoc, collection, query, getDocs, where } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'

export default function FutureLetterPage() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [type, setType] = useState<'success' | 'failure' | null>(null)
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [time, setTime] = useState<string>('12:00:00')
    const [userId, setUserId] = useState<string | null>(null)
    const router = useRouter()
    const searchParams = useSearchParams()
    const wishIdFromQuery = searchParams?.get('wishId')

    // 获取当前用户
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid)
            } else {
                if (typeof window !== 'undefined') {
                    window.location.href = '/login'
                }
            }
        })
        return () => unsub()
    }, [])

    useEffect(() => {
        if (!userId || !wishIdFromQuery) return

        const loadWish = async () => {
            try {
                const snap = await getDocs(
                    query(
                        collection(db, 'wishes'),
                        where('__name__', '==', wishIdFromQuery),
                        where('userId', '==', userId)
                    )
                )
                if (!snap.empty) {
                    const wish = snap.docs[0].data()
                    if (!title) setTitle(wish.title || '')
                    if (wish.targetDate && typeof wish.targetDate === 'string') {
                        const parsed = startOfDay(parseISO(wish.targetDate))
                        if (!isNaN(parsed.getTime())) {
                            setDate(parsed)  // 👈 确保 Calendar 能 match 上
                        }
                        console.log('💡 prefilled date =', parsed.toISOString())
                    }
                }
            } catch (err) {
                console.error('Failed to load wish:', err)
            }
        }
        loadWish()
    }, [userId, wishIdFromQuery])



    const handleSubmit = async () => {
        if (!title || !content || !date || !time || !type) return;

        const unlockTimestamp = `${format(date, 'yyyy-MM-dd')}T${time}`;

        const newLetter = {
            title,
            content,
            type,
            unlockTimestamp,
            userId,
            createdAt: new Date().toISOString(),
        };

        try {
            const docRef = await addDoc(collection(db, 'futureLetters'), newLetter);
            toast.success('Letter saved!');
            router.push(`/future-letter/${docRef.id}`);
        } catch (error) {
            toast.error('Failed to save letter.');
        }
    }


    const navItems = [
        { name: 'Home', href: '/' },
        { name: 'Wishes', href: '/wishes' },
        { name: 'Log', href: '/log' },
        { name: 'Charts', href: '/charts' },
        { name: 'Mood', href: '/mood-heatmap' },
        { name: 'Write Future Letters', href: '/future-letter/new' },
        { name: 'Logout', href: '/logout' },
    ]

    return (
        <div className={`min-h-screen bg-[#f2eafa] bg-no-repeat bg-top-right px-4 py-8 ${quicksand.className}`}>
            {/* 导航栏 */}
            <nav className="mb-6 flex justify-center gap-6 text-sm text-purple-700 font-medium">
                {navItems.map((item) => (
                    <a
                        key={item.name}
                        href={item.href}
                        className={`hover:underline hover:text-purple-900 ${item.href === '/future-letter/new' ? 'underline font-semibold text-purple-900' : ''
                            }`}
                    >
                        {item.name}
                    </a>
                ))}
            </nav>

            <h1 className={cn("text-3xl font-bold text-center text-purple-600 mb-6", dancingScript.className)}>
                💌 Future Letter
            </h1>
            {wishIdFromQuery && (
                <div className="text-sm bg-purple-100 border border-purple-300 text-purple-700 px-4 py-2 rounded-xl shadow-sm">
                    ✨ You’re writing a letter for a wish. The title and date have been prefilled.
                </div>
            )}
            <div className="max-w-2xl mx-auto space-y-6">
                <Card className="rounded-2xl shadow-lg border border-purple-200">
                    <CardContent className="space-y-4 p-6 text-purple-900">
                        <div>
                            <Label className={quicksand.className}>Title</Label>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Something to remind or encourage future me..." className="rounded-xl" />
                        </div>

                        <div>
                            <Label className={quicksand.className}>Message Type</Label>
                            <div className="flex flex-col gap-2 mt-2">
                                <Button variant={type === 'success' ? 'default' : 'outline'} onClick={() => setType('success')} className="rounded-xl w-full">
                                    🎯 I achieved it — Encourage myself
                                </Button>
                                <Button variant={type === 'failure' ? 'default' : 'outline'} onClick={() => setType('failure')} className="rounded-xl w-full">
                                    🌧 I didn't reach it — Comfort myself
                                </Button>
                            </div>
                        </div>

                        <div>
                            <Label className={quicksand.className}>Unlock Date</Label>
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(d: Date | undefined) => {
                                    if (d) setDate(d);
                                }}
                                disabled={(day: Date) => isBefore(day, startOfDay(new Date()))
                                }
                            />

                        </div>

                        <div>
                            <Label className={quicksand.className}>Unlock Time (HH:mm:ss)</Label>
                            <p className="text-sm text-gray-500 mb-1">* Uses 24-hour format (e.g. 18:30:00 for 6:30 PM)</p>
                            <TimePicker time={time} setTime={setTime} />
                        </div>

                        <div>
                            <Label className={quicksand.className}>Letter Content</Label>
                            <Textarea
                                rows={8}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write something to your future self. It can be encouragement, reflection, or hope."
                                className="rounded-xl"
                            />
                        </div>

                        <Button className="w-full rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-lg" onClick={handleSubmit}>
                            Save Letter
                        </Button>
                    </CardContent>
                </Card>

                {/* 👉 View all letters */}
                <div className="text-right">
                    <button
                        onClick={() => router.push('/future-letter')}
                        className="text-sm text-purple-600 underline hover:text-purple-800"
                    >
                        📂 View all my letters
                    </button>
                </div>
            </div>
        </div>
    )
}
