import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes("your-supabase-project-id") && 
  !supabaseAnonKey.includes("your-anon-key-signature");

// Mock Client Implementation
class MockSupabaseClient {
  private listeners: Map<string, Array<(payload: any) => void>> = new Map();

  public auth = {
    async signInWithOAuth(params: { provider: string; options?: { redirectTo?: string } }) {
      // console.log(`Mocking Supabase OAuth sign-in for provider: ${params.provider}`);
      if (typeof window !== "undefined") {
        const redirectTo = params.options?.redirectTo || `${window.location.origin}/auth/dashboard/student`;
        window.location.href = redirectTo;
      }
      return { data: { provider: params.provider, url: params.options?.redirectTo }, error: null };
    },
    async signOut() {
      return { error: null };
    },
    async getSession() {
      return { data: { session: null }, error: null };
    },
    async getUser() {
      return { data: { user: null }, error: null };
    }
  };

  constructor() {
    // Start background simulation to fire mock notifications
    if (typeof window !== "undefined") {
      setInterval(() => {
        this.triggerRealtimeNotification();
      }, 30000); // Trigger a mock event every 30 seconds
    }
  }

  private triggerRealtimeNotification() {
    const channelName = "schema-db-changes";
    const callbacks = this.listeners.get(channelName) || [];
    const names = ["Felix Chen", "Sarah Miller", "Ayush", "Hitesh", "Preeti"];
    const quizzes = ["React Architecture Fundamentals", "Machine Learning Operational Scaling", "AWS & Cloud Grid"];
    const name = names[Math.floor(Math.random() * names.length)];
    const quiz = quizzes[Math.floor(Math.random() * quizzes.length)];
    const score = Math.floor(Math.random() * 30) + 70;

    const payload = {
      new: {
        id: `n-mock-${Date.now()}`,
        title: "New Quiz Submission",
        message: `${name} completed ${quiz} with score ${score}%.`,
        isRead: false,
        userId: "inst-1",
        createdAt: new Date().toISOString(),
      },
    };

    callbacks.forEach((cb) => cb(payload));
  }

  // Trigger manually on quiz submits
  public triggerSubmissionNotification(studentName: string, quizTitle: string, score: number) {
    const channelName = "schema-db-changes";
    const callbacks = this.listeners.get(channelName) || [];
    const payload = {
      new: {
        id: `n-mock-${Date.now()}`,
        title: "Quiz Completed!",
        message: `${studentName} completed ${quizTitle} scoring ${score}%.`,
        isRead: false,
        userId: "inst-1",
        createdAt: new Date().toISOString(),
      },
    };
    callbacks.forEach((cb) => cb(payload));
  }

  channel(channelName: string) {
    const self = this;
    return {
      on(event: string, filter: any, callback: (payload: any) => void) {
        const listeners = self.listeners.get(channelName) || [];
        listeners.push(callback);
        self.listeners.set(channelName, listeners);
        return this;
      },
      subscribe(statusCallback?: (status: string) => void) {
        if (statusCallback) {
          setTimeout(() => statusCallback("SUBSCRIBED"), 100);
        }
        return {
          unsubscribe() {
            self.listeners.delete(channelName);
          },
        };
      },
    };
  }

  from(table: string) {
    return {
      select(query: string = "*") {
        return {
          order(col: string, opts?: any) {
            return Promise.resolve({ data: [], error: null });
          },
          eq(col: string, val: any) {
            return Promise.resolve({ data: [], error: null });
          },
          then(resolve: any) {
            resolve({ data: [], error: null });
          },
        };
      },
      insert(values: any) {
        return Promise.resolve({ data: values, error: null });
      },
      update(values: any) {
        return {
          eq(col: string, val: any) {
            return Promise.resolve({ data: values, error: null });
          },
        };
      },
      delete() {
        return {
          eq(col: string, val: any) {
            return Promise.resolve({ data: null, error: null });
          },
        };
      },
    };
  }
}

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (new MockSupabaseClient() as any);

export const isSupabaseConfigured = () => !!isConfigured;
