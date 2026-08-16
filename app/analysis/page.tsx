"use client";

import { useEffect, useState, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "@ai-sdk/react";
import {
  createChatGPTProxyProvider,
  ChatGPTProxyError,
} from "@opencoredev/loginwithchatgpt-ai";
import { useLoginWithChatGPT } from "@opencoredev/loginwithchatgpt-react";
import { getTransactions, Transaction } from "@/utils/dataManager";
import BackButton from "@/components/back-button";
import { Button } from "@/components/ui/button";
import { Streamdown } from "streamdown";
import {
  SendIcon,
  Loader2Icon,
  KeyRoundIcon,
  Trash2Icon,
  LogOutIcon,
  SparklesIcon,
  WalletIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "lucide-react";
import { SignIn } from "@/components/sign-in";

interface CategoryData {
  name: string;
  expense: number;
  income: number;
  percentage: number;
}

const SUGGESTED_PROMPTS = [
  "How am I doing this month?",
  "Where can I cut spending?",
  "Analyze my habits",
  "Tips to save more",
];

const chatgpt = createChatGPTProxyProvider();

function getInitialMessages(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("chat_messages");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export default function Analysis() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useLoginWithChatGPT({ basePath: "/api/chatgpt" });

  const { messages, sendMessage, status } = useChat({
    messages: getInitialMessages(),
  });

  useEffect(() => {
    chatgpt
      .listModels()
      .then(() => setIsAuthenticated(true))
      .catch((error) => {
        if (error instanceof ChatGPTProxyError && error.status === 401) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(false);
        }
      });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chat_messages", JSON.stringify(messages));
    }
  }, [messages]);

  const clearMessages = () => {
    localStorage.removeItem("chat_messages");
    window.location.reload();
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      localStorage.removeItem("chat_messages");
      window.location.reload();
    } catch {
      setIsLoggingOut(false);
    }
  };

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    const txns = getTransactions();
    setTransactions(txns);

    // Calculate category data
    const categoryMap = txns.reduce(
      (acc, t) => {
        if (!acc[t.category]) acc[t.category] = { expense: 0, income: 0 };
        acc[t.category][t.type] += t.amount;
        return acc;
      },
      {} as Record<string, { expense: number; income: number }>,
    );

    const totalExpense = txns
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const data = Object.entries(categoryMap).map(([name, data]) => ({
      name,
      expense: data.expense,
      income: data.income,
      percentage: totalExpense > 0 ? (data.expense / totalExpense) * 100 : 0,
    }));

    setCategoryData(data.sort((a, b) => b.expense - a.expense));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (input.trim() && status === "ready") {
      sendMessage(
        { text: input },
        {
          body: {
            transactions,
            categoryData,
          },
        },
      );
      setInput("");
      inputRef.current?.focus();
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    if (status === "ready") {
      sendMessage(
        { text: prompt },
        {
          body: {
            transactions,
            categoryData,
          },
        },
      );
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
        <BackButton />

        <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
          Finance Assistant
        </h2>

        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearMessages}
              aria-label="Clear messages">
              <Trash2Icon className="h-4 w-4 opacity-70" />
            </Button>
          )}
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              disabled={isLoggingOut}
              aria-label="Logout">
              {isLoggingOut ? (
                <Loader2Icon className="h-4 w-4 animate-spin opacity-70" />
              ) : (
                <LogOutIcon className="h-4 w-4 opacity-70" />
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 px-3 flex flex-col">
        {isAuthenticated === null ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2Icon className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : !isAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
              <KeyRoundIcon className="w-7 h-7 text-muted-foreground" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-medium">Connect ChatGPT</h3>
              <p className="text-sm text-muted-foreground max-w-[260px]">
                Sign in with your ChatGPT account to unlock AI-powered financial
                insights.
              </p>
            </div>
            <SignIn />
          </div>
        ) : (
          <>
            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-6 py-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                    <div className="rounded-xl border border-border p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <ArrowUpIcon className="w-3 h-3 text-emerald-500" />
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                          Income
                        </span>
                      </div>
                      <p className="text-sm font-semibold tabular-nums">
                        ${totalIncome.toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <ArrowDownIcon className="w-3 h-3 text-red-500" />
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                          Expense
                        </span>
                      </div>
                      <p className="text-sm font-semibold tabular-nums">
                        ${totalExpense.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Suggested Prompts */}
                  <div className="w-full max-w-xs space-y-2">
                    <p className="text-xs text-muted-foreground text-center">
                      Try asking
                    </p>
                    <div className="space-y-1.5">
                      {SUGGESTED_PROMPTS.map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => handleSuggestedPrompt(prompt)}
                          disabled={status !== "ready"}
                          className="w-full text-left text-sm px-4 py-2.5 bg-muted/50 hover:bg-muted rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2">
                          <WalletIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 py-2">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}>
                      <div
                        className={`max-w-[85%] rounded-full ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground px-4 py-2.5"
                            : "px-1 py-2.5"
                        }`}>
                        {message.role === "user" ? (
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">
                            {message.parts
                              .filter(
                                (
                                  part: any,
                                ): part is { type: "text"; text: string } =>
                                  part.type === "text",
                              )
                              .map(
                                (part: { type: "text"; text: string }) =>
                                  part.text,
                              )
                              .join("")}
                          </p>
                        ) : (
                          <div className="text-sm leading-relaxed">
                            {message.parts
                              .filter(
                                (
                                  part: any,
                                ): part is { type: "text"; text: string } =>
                                  part.type === "text",
                              )
                              .map(
                                (
                                  part: { type: "text"; text: string },
                                  index: number,
                                ) => (
                                  <Streamdown
                                    className="text-sm list-inside"
                                    key={index}
                                    isAnimating={status === "streaming"}>
                                    {part.text}
                                  </Streamdown>
                                ),
                              )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading &&
                    messages[messages.length - 1]?.role === "user" && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-2xl px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            />
                            <span
                              className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            />
                            <span
                              className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex gap-2 shrink-0 pb-4 pt-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your finances..."
                disabled={status !== "ready"}
                className="flex-1 bg-muted/50 border border-border rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-muted transition-colors disabled:opacity-50 placeholder:text-muted-foreground/60"
              />
              <Button
                type="submit"
                size="icon"
                disabled={status !== "ready" || !input.trim()}
                className="rounded-full h-10 w-10 flex-shrink-0">
                {isLoading ? (
                  <Loader2Icon className="w-4 h-4 animate-spin" />
                ) : (
                  <SendIcon className="w-4 h-4" />
                )}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
