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

export default function FutureLetterPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'success' | 'failure' | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>('12:00:00');

  const handleSubmit = () => {
    if (!title || !content || !date || !time || !type) return;
    const unlockTimestamp = `${format(date, 'yyyy-MM-dd')}T${time}`;
    console.log({ title, content, type, unlockTimestamp });
    // TODO: Save API call
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className={cn("text-3xl font-bold text-center text-purple-600", dancingScript.className)}>
        Future Letter
      </h1>

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
  );
}
