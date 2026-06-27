<?php

namespace App\Events\ExamEvent;

use App\Models\Exam;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ExamCreatedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    private Exam $exam;
    private int $userId;

    public function __construct(Exam $exam,int $userId) {
        $this->exam = $exam;
        $this->userId = $userId;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel("users.{$this->userId}")
        ];
    }

    public function broadcastAs(): string
    {
        return 'exam.created';
    }
}
