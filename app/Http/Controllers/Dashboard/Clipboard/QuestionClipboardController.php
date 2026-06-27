<?php

namespace App\Http\Controllers\Dashboard\Clipboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Clipboard\Question\DeleteQuestionRequest;
use App\Http\Requests\Clipboard\Question\PasteQuestionRequest;
use App\Http\Requests\Clipboard\Question\MoveQuestionRequest;
use App\Http\Requests\Clipboard\Question\DuplicateQuestionRequest;
use App\Jobs\ClipboardJob\ProcessDeleteQuestion;
use App\Jobs\ClipboardJob\ProcessDuplicateQuestion;
use App\Jobs\ClipboardJob\ProcessJobMoveQuestion;
use App\Jobs\ClipboardJob\ProcessJobPasteQuestion;
use Illuminate\Support\Facades\Auth;

class QuestionClipboardController extends Controller
{

    public function pasteQuestion(PasteQuestionRequest $request)
    {
        $user = Auth::user();
        ProcessJobPasteQuestion::dispatch($user, $request->validated());

        return redirect()->back()->with('success', 'Question paste Processing...');
    }

    public function moveQuestion(MoveQuestionRequest $request)
    {
        $user = Auth::user();
        ProcessJobMoveQuestion::dispatch($user, $request->validated());

        return redirect()->back()->with('success', 'Question move Processing...');
    }

    
    public function duplicateQuestion(DuplicateQuestionRequest $request)
    {
        $user = Auth::user();
        ProcessDuplicateQuestion::dispatch($user, $request->validated());

        return redirect()->back()->with('success', 'Question duplicate Processing...');
    }


    public function deleteQuestion(DeleteQuestionRequest $request)
    {
        $user = Auth::user();
        ProcessDeleteQuestion::dispatch($user, $request->validated());

        return redirect()->back()->with('success', 'Question delete Processing...');
    }
}
