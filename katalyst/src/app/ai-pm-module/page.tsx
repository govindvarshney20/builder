"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { aiPmLessons } from "@/data/ai-pm-lessons";
import { getProgress, saveProgress, addXP } from "@/lib/storage";
import { askGemini } from "@/lib/gemini";

interface Lesson {
  id: string;
  title: string;
  description: string;
  order: number;
  sections: { heading: string; content: string; keyPoints: string[] }[];
  quiz: { question: string; options: string[]; correctIndex: number; explanation: string }[];
}

export default function AIPmModulePage() {
  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    (aiPmLessons as Lesson[])[0]?.id ?? ""
  );
  const [lessonsCompleted, setLessonsCompleted] = useState<string[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>(
    {}
  );
  const [aiResponses, setAiResponses] = useState<Record<string, string>>({});
  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});
  const [floatingQuery, setFloatingQuery] = useState("");
  const [floatingResponse, setFloatingResponse] = useState("");
  const [floatingLoading, setFloatingLoading] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const lessonContentRef = useRef<HTMLDivElement>(null);

  const lessons = aiPmLessons as Lesson[];
  const sortedLessons = [...lessons].sort((a, b) => a.order - b.order);
  const selectedLesson: Lesson | undefined = lessons.find(
    (l: Lesson) => l.id === selectedLessonId
  );
  const completedCount = lessonsCompleted.length;

  // Load progress from storage
  useEffect(() => {
    const progress = getProgress();
    setLessonsCompleted(progress.lessonsCompleted ?? []);
  }, []);

  // Select a lesson and scroll to top
  const selectLesson = useCallback((id: string) => {
    setSelectedLessonId(id);
    setQuizAnswers({});
    setQuizSubmitted({});
    setFloatingQuery("");
    setFloatingResponse("");
    setMobileDropdownOpen(false);
    lessonContentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Handle quiz answer selection
  const handleQuizAnswer = useCallback(
    (questionIndex: number, optionIndex: number) => {
      if (quizSubmitted[questionIndex]) return;
      setQuizAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
    },
    [quizSubmitted]
  );

  // Submit a quiz answer
  const submitQuizAnswer = useCallback(
    (questionIndex: number) => {
      setQuizSubmitted((prev) => ({ ...prev, [questionIndex]: true }));

      // Check if all questions answered correctly after this submission
      if (!selectedLesson) return;
      const quiz = selectedLesson.quiz;
      const updatedSubmitted: Record<number, boolean> = { ...quizSubmitted, [questionIndex]: true };
      const updatedAnswers: Record<number, number> = { ...quizAnswers };

      const allAnswered = quiz.every(
        (_: Lesson["quiz"][number], idx: number) => updatedSubmitted[idx] === true
      );
      const allCorrect = quiz.every(
        (q: Lesson["quiz"][number], idx: number) => updatedAnswers[idx] === q.correctIndex
      );

      if (
        allAnswered &&
        allCorrect &&
        !lessonsCompleted.includes(selectedLesson.id)
      ) {
        const updated = [...lessonsCompleted, selectedLesson.id];
        setLessonsCompleted(updated);
        saveProgress({ lessonsCompleted: updated });
        addXP(30);
      }
    },
    [quizAnswers, quizSubmitted, selectedLesson, lessonsCompleted]
  );

  // Ask AI about a section
  const handleAskAI = useCallback(
    async (sectionIndex: number, heading: string, content: string) => {
      const key = `${selectedLessonId}-${sectionIndex}`;
      if (aiLoading[key]) return;

      setAiLoading((prev) => ({ ...prev, [key]: true }));
      setAiResponses((prev) => ({ ...prev, [key]: "" }));

      try {
        const prompt = `You are a world-class AI Product Management instructor. A student is learning about "${selectedLesson?.title}" and needs help understanding this section:

Section: "${heading}"
Content: "${content}"

Explain this concept in a clear, engaging way with practical examples. Keep your response concise (3-5 paragraphs). Use real-world examples from companies like Google, Meta, OpenAI, or other tech companies where relevant.`;

        const response = await askGemini(prompt, "You are Katalyst AI, an expert PM coach specializing in AI product management.");
        setAiResponses((prev) => ({ ...prev, [key]: response }));
      } catch {
        setAiResponses((prev) => ({
          ...prev,
          [key]: "Sorry, I couldn't generate a response right now. Please try again.",
        }));
      } finally {
        setAiLoading((prev) => ({ ...prev, [key]: false }));
      }
    },
    [selectedLessonId, selectedLesson, aiLoading]
  );

  // Floating AI query
  const handleFloatingAsk = useCallback(async () => {
    if (!floatingQuery.trim() || floatingLoading || !selectedLesson) return;

    setFloatingLoading(true);
    setFloatingResponse("");

    try {
      const prompt = `You are Katalyst AI, an expert AI Product Management instructor. The student is currently studying the lesson "${selectedLesson.title}" which covers: ${selectedLesson.description}.

The student asks: "${floatingQuery}"

Provide a helpful, concise answer that relates to the lesson context when relevant. Use real-world examples and be practical.`;

      const response = await askGemini(prompt, "You are Katalyst AI, an expert PM coach specializing in AI product management.");
      setFloatingResponse(response);
    } catch {
      setFloatingResponse(
        "Sorry, I couldn't process your question. Please try again."
      );
    } finally {
      setFloatingLoading(false);
    }
  }, [floatingQuery, floatingLoading, selectedLesson]);

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">
          AI PM Mastery
        </h1>
        <p className="text-muted text-sm sm:text-base">
          Master AI product management through 10 structured lessons with
          quizzes and AI-powered explanations.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border border-border rounded-xl p-4 sm:p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-foreground">
            Course Progress
          </span>
          <span className="text-sm font-semibold text-primary">
            {completedCount}/10 Lessons
          </span>
        </div>
        <div className="w-full bg-surface-hover rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(completedCount / 10) * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted">
            {completedCount === 10
              ? "Congratulations! Course complete!"
              : `${10 - completedCount} lessons remaining`}
          </span>
          <span className="text-xs text-muted">
            {completedCount * 30} XP earned
          </span>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
          className="w-full bg-white border border-border rounded-xl px-4 py-3 flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
              {selectedLesson
                ? sortedLessons.findIndex((l: Lesson) => l.id === selectedLesson.id) + 1
                : "-"}
            </span>
            <span className="text-sm font-medium text-foreground truncate">
              {selectedLesson?.title ?? "Select a lesson"}
            </span>
          </div>
          <svg
            className={`w-4 h-4 text-muted flex-shrink-0 transition-transform ${
              mobileDropdownOpen ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {mobileDropdownOpen && (
          <div className="mt-1 bg-white border border-border rounded-xl shadow-lg overflow-hidden z-20 relative">
            {sortedLessons.map((lesson, idx) => {
              const isCompleted = lessonsCompleted.includes(lesson.id);
              const isActive = lesson.id === selectedLessonId;
              return (
                <button
                  key={lesson.id}
                  onClick={() => selectLesson(lesson.id)}
                  className={`w-full px-4 py-3 flex items-center gap-3 text-left text-sm transition-colors border-b border-border last:border-b-0 ${
                    isActive
                      ? "bg-primary/5 text-primary-dark"
                      : "hover:bg-surface-hover text-foreground"
                  }`}
                >
                  <span
                    className={`flex-shrink-0 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                      isCompleted
                        ? "bg-success text-white"
                        : isActive
                        ? "bg-primary text-white"
                        : "bg-surface-hover text-muted"
                    }`}
                  >
                    {isCompleted ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      idx + 1
                    )}
                  </span>
                  <span className="truncate font-medium">{lesson.title}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Layout: Sidebar + Content */}
      <div className="flex gap-6">
        {/* Left Panel - Lessons List (desktop) */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="bg-white border border-border rounded-xl overflow-hidden sticky top-6">
            <div className="px-4 py-3 border-b border-border bg-surface-hover/50">
              <h2 className="text-sm font-semibold text-foreground">
                Lessons
              </h2>
            </div>
            <nav className="max-h-[calc(100vh-280px)] overflow-y-auto">
              {sortedLessons.map((lesson, idx) => {
                const isCompleted = lessonsCompleted.includes(lesson.id);
                const isActive = lesson.id === selectedLessonId;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => selectLesson(lesson.id)}
                    className={`w-full px-4 py-3 flex items-center gap-3 text-left text-sm transition-colors border-b border-border last:border-b-0 ${
                      isActive
                        ? "bg-primary/5 border-l-2 !border-l-primary"
                        : "hover:bg-surface-hover"
                    }`}
                  >
                    <span
                      className={`flex-shrink-0 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
                        isCompleted
                          ? "bg-success text-white"
                          : isActive
                          ? "bg-primary text-white"
                          : "bg-surface-hover text-muted"
                      }`}
                    >
                      {isCompleted ? (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        idx + 1
                      )}
                    </span>
                    <div className="min-w-0">
                      <p
                        className={`font-medium truncate ${
                          isActive ? "text-primary-dark" : "text-foreground"
                        }`}
                      >
                        {lesson.title}
                      </p>
                      <p className="text-xs text-muted truncate mt-0.5">
                        {lesson.sections.length} sections &middot;{" "}
                        {lesson.quiz.length} quiz Qs
                      </p>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Right Panel - Lesson Content */}
        <div className="flex-1 min-w-0">
          {selectedLesson ? (
            <div ref={lessonContentRef} className="space-y-6 pb-32">
              {/* Lesson Header */}
              <div className="bg-white border border-border rounded-xl p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                        Lesson{" "}
                        {sortedLessons.findIndex(
                          (l) => l.id === selectedLesson.id
                        ) + 1}
                      </span>
                      {lessonsCompleted.includes(selectedLesson.id) && (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-success/10 text-success">
                          Completed
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                      {selectedLesson.title}
                    </h2>
                  </div>
                  {lessonsCompleted.includes(selectedLesson.id) && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-muted text-sm sm:text-base leading-relaxed">
                  {selectedLesson.description}
                </p>
              </div>

              {/* Sections */}
              {selectedLesson.sections.map((section: Lesson["sections"][number], sIdx: number) => {
                const aiKey = `${selectedLessonId}-${sIdx}`;
                return (
                  <div
                    key={sIdx}
                    className="bg-white border border-border rounded-xl p-5 sm:p-6"
                  >
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      {section.heading}
                    </h3>
                    <div className="text-sm sm:text-base text-foreground/85 leading-relaxed whitespace-pre-line mb-4">
                      {section.content}
                    </div>

                    {/* Key Points */}
                    {section.keyPoints.length > 0 && (
                      <div className="bg-primary/[0.03] border border-primary/10 rounded-lg p-4 mb-4">
                        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                          Key Takeaways
                        </p>
                        <ul className="space-y-2">
                          {section.keyPoints.map((point: string, pIdx: number) => (
                            <li
                              key={pIdx}
                              className="flex items-start gap-2.5 text-sm text-foreground/80"
                            >
                              <svg
                                className="w-4 h-4 text-primary flex-shrink-0 mt-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Ask AI Button */}
                    <button
                      onClick={() =>
                        handleAskAI(sIdx, section.heading, section.content)
                      }
                      disabled={!!aiLoading[aiKey]}
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors disabled:opacity-50"
                    >
                      {aiLoading[aiKey] ? (
                        <>
                          <svg
                            className="w-4 h-4 animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          AI is thinking...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                          Ask AI to explain this
                        </>
                      )}
                    </button>

                    {/* AI Response */}
                    {aiResponses[aiKey] && (
                      <div className="mt-4 bg-gradient-to-br from-primary/[0.04] to-accent/[0.04] border border-primary/15 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                            AI Explanation
                          </span>
                        </div>
                        <div className="prose-content text-sm text-foreground/85 leading-relaxed">
                          {aiResponses[aiKey]}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Quiz Section */}
              {selectedLesson.quiz.length > 0 && (
                <div className="bg-white border border-border rounded-xl p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-lg bg-warning/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        Knowledge Check
                      </h3>
                      <p className="text-xs text-muted">
                        Answer all questions correctly to complete this lesson
                        (+30 XP)
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {selectedLesson.quiz.map((q: Lesson["quiz"][number], qIdx: number) => {
                      const selected = quizAnswers[qIdx];
                      const submitted = quizSubmitted[qIdx];
                      const isCorrect = selected === q.correctIndex;

                      return (
                        <div
                          key={qIdx}
                          className={`border rounded-lg p-4 transition-colors ${
                            submitted
                              ? isCorrect
                                ? "border-success/30 bg-success/[0.03]"
                                : "border-danger/30 bg-danger/[0.03]"
                              : "border-border"
                          }`}
                        >
                          <p className="text-sm font-semibold text-foreground mb-3">
                            <span className="text-muted mr-2">
                              Q{qIdx + 1}.
                            </span>
                            {q.question}
                          </p>
                          <div className="space-y-2 mb-3">
                            {q.options.map((option: string, oIdx: number) => {
                              const isSelected = selected === oIdx;
                              const isCorrectOption =
                                submitted && oIdx === q.correctIndex;
                              const isWrongSelected =
                                submitted && isSelected && !isCorrect;

                              return (
                                <button
                                  key={oIdx}
                                  onClick={() => handleQuizAnswer(qIdx, oIdx)}
                                  disabled={!!submitted}
                                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all border ${
                                    isCorrectOption
                                      ? "border-success bg-success/10 text-success font-medium"
                                      : isWrongSelected
                                      ? "border-danger bg-danger/10 text-danger"
                                      : isSelected
                                      ? "border-primary bg-primary/5 text-primary-dark font-medium"
                                      : "border-border hover:border-primary/30 hover:bg-primary/[0.02] text-foreground"
                                  } disabled:cursor-default`}
                                >
                                  <span className="inline-flex items-center gap-2.5">
                                    <span
                                      className={`flex-shrink-0 w-5 h-5 rounded-full border text-xs font-bold flex items-center justify-center ${
                                        isCorrectOption
                                          ? "border-success bg-success text-white"
                                          : isWrongSelected
                                          ? "border-danger bg-danger text-white"
                                          : isSelected
                                          ? "border-primary bg-primary text-white"
                                          : "border-border text-muted"
                                      }`}
                                    >
                                      {isCorrectOption ? (
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                      ) : isWrongSelected ? (
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                      ) : (
                                        String.fromCharCode(65 + oIdx)
                                      )}
                                    </span>
                                    {option}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Submit button */}
                          {!submitted && selected !== undefined && (
                            <button
                              onClick={() => submitQuizAnswer(qIdx)}
                              className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                            >
                              Submit Answer
                            </button>
                          )}

                          {/* Explanation */}
                          {submitted && (
                            <div
                              className={`mt-3 p-3 rounded-lg text-sm ${
                                isCorrect
                                  ? "bg-success/10 text-success"
                                  : "bg-danger/10 text-danger"
                              }`}
                            >
                              <p className="font-semibold mb-1">
                                {isCorrect ? "Correct!" : "Not quite right."}
                              </p>
                              <p className="opacity-90">{q.explanation}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Lesson completion message */}
                  {lessonsCompleted.includes(selectedLesson.id) && (
                    <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-success text-sm">
                          Lesson Complete!
                        </p>
                        <p className="text-success/80 text-xs">
                          You earned 30 XP for completing this lesson.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-border rounded-xl p-12 text-center">
              <p className="text-muted">
                Select a lesson from the sidebar to get started.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Floating AI Input */}
      {selectedLesson && (
        <div className="fixed bottom-0 left-0 right-0 md:left-64 z-30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-4">
            <div className="bg-white border border-border rounded-xl shadow-lg overflow-hidden">
              {/* Floating response */}
              {floatingResponse && (
                <div className="px-4 py-3 border-b border-border max-h-48 overflow-y-auto">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      AI Response
                    </span>
                    <button
                      onClick={() => setFloatingResponse("")}
                      className="ml-auto text-muted hover:text-foreground text-xs"
                    >
                      Dismiss
                    </button>
                  </div>
                  <p className="text-sm text-foreground/85 leading-relaxed prose-content">
                    {floatingResponse}
                  </p>
                </div>
              )}

              {/* Input area */}
              <div className="flex items-center gap-2 p-3">
                <svg
                  className="w-5 h-5 text-primary flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <input
                  type="text"
                  value={floatingQuery}
                  onChange={(e) => setFloatingQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleFloatingAsk();
                  }}
                  placeholder={`Ask AI about "${selectedLesson.title}"...`}
                  className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted"
                />
                <button
                  onClick={handleFloatingAsk}
                  disabled={!floatingQuery.trim() || floatingLoading}
                  className="bg-primary text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 flex items-center gap-1.5"
                >
                  {floatingLoading ? (
                    <>
                      <svg
                        className="w-3.5 h-3.5 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Thinking...
                    </>
                  ) : (
                    "Ask"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
