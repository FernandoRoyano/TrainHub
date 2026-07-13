import { describe, it, expect, vi, beforeEach } from "vitest";

// Build a flexible chain mock that supports any depth of .eq().eq().order() etc.
function createChain(resolvedValue?: unknown) {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {};
  chain.select = vi.fn().mockReturnValue(chain);
  chain.insert = vi.fn().mockReturnValue(chain);
  chain.delete = vi.fn().mockReturnValue(chain);
  chain.update = vi.fn().mockReturnValue(chain);
  chain.eq = vi.fn().mockReturnValue(chain);
  chain.order = vi.fn().mockResolvedValue(resolvedValue ?? { data: [], error: null });
  chain.single = vi.fn().mockResolvedValue(resolvedValue ?? { data: null, error: null });
  chain.limit = vi.fn().mockReturnValue(chain);
  chain.maybeSingle = vi.fn().mockResolvedValue(resolvedValue ?? { data: null, error: null });
  chain.range = vi.fn().mockResolvedValue(resolvedValue ?? { data: [], count: 0, error: null });
  return chain;
}

const mockGetUser = vi.fn();
let currentChain: ReturnType<typeof createChain>;
const tableCalls: string[] = [];
let chainForTable: Record<string, ReturnType<typeof createChain>> = {};

const mockSupabase = {
  auth: {
    getUser: mockGetUser,
    getSession: async () => {
      const { data } = await mockGetUser();
      return { data: { session: data?.user ? { user: data.user } : null } };
    },
  },
  from: vi.fn().mockImplementation((table: string) => {
    tableCalls.push(table);
    if (chainForTable[table]) return chainForTable[table];
    currentChain = createChain();
    return currentChain;
  }),
};

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => mockSupabase,
}));

const { questionnairesService } = await import(
  "@/services/questionnaires.service"
);

describe("questionnairesService.getTemplates", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    tableCalls.length = 0;
    chainForTable = {};
    mockSupabase.from.mockImplementation((table: string) => {
      tableCalls.push(table);
      if (chainForTable[table]) return chainForTable[table];
      return createChain();
    });
  });

  it("returns templates for authenticated user", async () => {
    const templates = [{ id: "t1", name: "Intake", trainer_id: "trainer-1" }];
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });

    const chain = createChain();
    chain.order.mockResolvedValue({ data: templates, error: null });
    chainForTable["questionnaire_templates"] = chain;

    const result = await questionnairesService.getTemplates();

    expect(mockSupabase.from).toHaveBeenCalledWith("questionnaire_templates");
    expect(chain.select).toHaveBeenCalledWith("*");
    expect(result).toEqual(templates);
  });

  it("throws when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    await expect(questionnairesService.getTemplates()).rejects.toThrow(
      "Not authenticated"
    );
  });

  it("throws when supabase returns an error", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });

    const chain = createChain();
    chain.order.mockResolvedValue({ data: null, error: { message: "RLS violation" } });
    chainForTable["questionnaire_templates"] = chain;

    await expect(questionnairesService.getTemplates()).rejects.toThrow();
  });
});

describe("questionnairesService.getTemplateById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    tableCalls.length = 0;
    chainForTable = {};
    mockSupabase.from.mockImplementation((table: string) => {
      tableCalls.push(table);
      if (chainForTable[table]) return chainForTable[table];
      return createChain();
    });
  });

  it("returns template with questions", async () => {
    const template = { id: "t1", name: "Intake" };
    const questions = [{ id: "q1", template_id: "t1", question_text: "Age?" }];

    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "questionnaire_templates") {
        const chain = createChain();
        chain.single.mockResolvedValue({ data: template, error: null });
        return chain;
      }
      if (table === "questionnaire_questions") {
        const chain = createChain();
        chain.order.mockResolvedValue({ data: questions, error: null });
        return chain;
      }
      return createChain();
    });

    const result = await questionnairesService.getTemplateById("t1");

    expect(mockSupabase.from).toHaveBeenCalledWith("questionnaire_templates");
    expect(mockSupabase.from).toHaveBeenCalledWith("questionnaire_questions");
    expect(result).toEqual({ ...template, questions });
  });
});

describe("questionnairesService.createTemplate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    tableCalls.length = 0;
    chainForTable = {};
    mockSupabase.from.mockImplementation((table: string) => {
      tableCalls.push(table);
      if (chainForTable[table]) return chainForTable[table];
      return createChain();
    });
  });

  it("inserts template and questions", async () => {
    const createdTemplate = { id: "t-new", name: "New Form" };
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });

    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "questionnaire_templates") {
        const chain = createChain();
        chain.single.mockResolvedValue({ data: createdTemplate, error: null });
        return chain;
      }
      if (table === "questionnaire_questions") {
        const chain = createChain();
        chain.insert.mockReturnValue({ error: null });
        return chain;
      }
      return createChain();
    });

    const formData = {
      name: "New Form",
      description: "desc",
      questions: [
        {
          question_text: "How old?",
          question_type: "number" as const,
          is_required: true,
          order_index: 0,
        },
      ],
    };

    const result = await questionnairesService.createTemplate(formData);

    expect(mockSupabase.from).toHaveBeenCalledWith("questionnaire_templates");
    expect(result).toEqual(createdTemplate);
  });

  it("throws when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    await expect(
      questionnairesService.createTemplate({
        name: "Test",
        questions: [],
      })
    ).rejects.toThrow("Not authenticated");
  });
});

describe("questionnairesService.deleteTemplate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    tableCalls.length = 0;
    chainForTable = {};
    mockSupabase.from.mockImplementation((table: string) => {
      tableCalls.push(table);
      if (chainForTable[table]) return chainForTable[table];
      return createChain();
    });
  });

  it("calls delete on questionnaire_templates", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });

    // Use a chain where the last eq resolves properly.
    // delete().eq("id", id).eq("trainer_id", uid) - two eq calls.
    // We need the second eq to resolve, so use mockReturnValueOnce for the
    // first call (returns chain) and mockResolvedValueOnce for the second.
    const chain = createChain();
    chain.eq
      .mockReturnValueOnce(chain) // first .eq("id", id) returns chain
      .mockResolvedValueOnce({ error: null }); // second .eq("trainer_id") resolves
    chainForTable["questionnaire_templates"] = chain;

    await questionnairesService.deleteTemplate("t1");

    expect(mockSupabase.from).toHaveBeenCalledWith("questionnaire_templates");
    expect(chain.delete).toHaveBeenCalled();
    expect(chain.eq).toHaveBeenCalledWith("id", "t1");
    expect(chain.eq).toHaveBeenCalledWith("trainer_id", "trainer-1");
  });

  it("throws when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    await expect(
      questionnairesService.deleteTemplate("t1")
    ).rejects.toThrow("Not authenticated");
  });
});

describe("questionnairesService.assignToClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    tableCalls.length = 0;
    chainForTable = {};
    mockSupabase.from.mockImplementation((table: string) => {
      tableCalls.push(table);
      if (chainForTable[table]) return chainForTable[table];
      return createChain();
    });
  });

  it("inserts client_questionnaire", async () => {
    const assignment = { id: "cq-1", client_id: "c1", template_id: "t1" };
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });

    const chain = createChain();
    chain.single.mockResolvedValue({ data: assignment, error: null });
    chainForTable["client_questionnaires"] = chain;

    const result = await questionnairesService.assignToClient({
      client_id: "c1",
      template_id: "t1",
    });

    expect(mockSupabase.from).toHaveBeenCalledWith("client_questionnaires");
    expect(chain.insert).toHaveBeenCalled();
    expect(result).toEqual(assignment);
  });

  it("throws when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    await expect(
      questionnairesService.assignToClient({
        client_id: "c1",
        template_id: "t1",
      })
    ).rejects.toThrow("Not authenticated");
  });
});

describe("questionnairesService.getClientQuestionnaires", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    tableCalls.length = 0;
    chainForTable = {};
    mockSupabase.from.mockImplementation((table: string) => {
      tableCalls.push(table);
      if (chainForTable[table]) return chainForTable[table];
      return createChain();
    });
  });

  it("returns assignments for a client", async () => {
    const assignments = [{ id: "cq-1", client_id: "c1", status: "pending" }];
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });

    const chain = createChain();
    chain.order.mockResolvedValue({ data: assignments, error: null });
    chainForTable["client_questionnaires"] = chain;

    const result = await questionnairesService.getClientQuestionnaires("c1");

    expect(mockSupabase.from).toHaveBeenCalledWith("client_questionnaires");
    expect(result).toEqual(assignments);
  });

  it("throws when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    await expect(
      questionnairesService.getClientQuestionnaires("c1")
    ).rejects.toThrow("Not authenticated");
  });
});
