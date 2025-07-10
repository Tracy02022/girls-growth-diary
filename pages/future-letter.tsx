'use client'

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { TimePicker } from '@/components/ui/time-picker';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { quicksand, dancingScript } from '@/lib/fonts';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useRouter } from 'next/router';

export default function FutureLetterPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'success' | 'failure' | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>('12:00:00');
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!title || !content || !date || !time || !type) {
      alert('Please fill out all fields.')
      return
    }
  
    const user = auth.currentUser
    if (!user) {
      alert('You must be logged in to save a letter.')
      return
    }
  
    const unlockTimestamp = `${format(date, 'yyyy-MM-dd')}T${time}`
    const newLetter = {
      userId: user.uid,
      title,
      content,
      type,
      unlockTimestamp,
      createdAt: new Date().toISOString(),
    }
  
    try {
      const docRef = await addDoc(collection(db, 'futureLetters'), newLetter)
      setShowToast(true)
      setTimeout(() => {
        setShowToast(false)
        router.push(`/future-letter/${docRef.id}`) // ✅ 跳转到详情页
      }, 1500)
    } catch (err) {
      console.error(err)
      alert('Failed to save letter.')
    }
  }

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Wishes', href: '/wishes' },
    { name: 'Log', href: '/log' },
    { name: 'Charts', href: '/charts' },
    { name: 'Mood', href: '/mood-heatmap' },
    { name: 'Future Letter', href: '/future-letter' },
  ];

  return (
    <div className={`min-h-screen bg-[#f2eafa] bg-no-repeat bg-top-right px-4 py-8 ${quicksand.className}`}>
      {/* 导航栏 */}
      <nav className="mb-6 flex justify-center gap-6 text-sm text-purple-700 font-medium">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={`hover:underline hover:text-purple-900 ${
              item.href === '/future-letter' ? 'underline font-semibold text-purple-900' : ''
            }`}
          >
            {item.name}
          </a>
        ))}
      </nav>

      <h1 className={cn("text-3xl font-bold text-center text-purple-600 mb-6", dancingScript.className)}>
        💌 Future Letter
      </h1>

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
              <Calendar mode="single" selected={date} onSelect={setDate} disabled={(day) => day < new Date()} />
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
      </div>

      <div className="mt-6 max-w-2xl mx-auto text-right">
        <a
          href="/future-letter"
          className="text-sm text-purple-600 underline hover:text-purple-800"
        >
          📂 View all my letters
        </a>
      </div>

      {/* ✅ 成功提示 Toast */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-sm px-6 py-3 rounded-xl shadow-lg z-50">
          ✅ Letter saved! Redirecting...
        </div>
      )}
    </div>
  );
}
