<?php

namespace App\Events\ExamEvent;

use App\Models\Exam;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ExamUpdatedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Exam $exam,
        public int $userId
    ) {
    }

    public function broadcastOn(): array
    {
        return [
            new Channel("users.{$this->userId}")
        ];
    }

    public function broadcastAs(): string
    {
        return 'exam.updated';
    }
}
