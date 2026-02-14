import { db } from "./index"
import { and, eq, isNull } from "drizzle-orm";
import { 
  users,
  projects, 
  tasks,
  timerSessions,
  comments, 
  type NewUser, 
  type NewProject, 
  type NewTask,
  type NewTimerSession,
  type NewComment 
} from "./schema"


// User Queries
export const createUser = async (data: NewUser) => {
  const [user] = await db.insert(users).values(data).returning();
  return user;
};

export const getUserById = async (id: string) => {
  return db.query.users.findFirst({
    where: eq(users.id, id),
  });
};

export const updateUser = async (id: string, data: Partial<NewUser>) => {
  const existingUser = await getUserById(id);
  if (!existingUser) {
    throw new Error(`User with id ${id} does not exist`);
  }
  const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
  return user;
};

// upsert => create or update
export const upsertUser = async (data: NewUser) => {
  const [user] = await db
    .insert(users)
    .values(data)
    .onConflictDoUpdate({
      target: users.id,
      set: data,
    })
    .returning();
  return user;
};

// Project Queries
export const createProject = async (data: NewProject) => {
  const [project] = await db.insert(projects).values(data).returning();
  return project;
};

export const getAllProjects = async () => {
  return db.query.projects.findMany({
    with: {user: true},
    orderBy: (projects, { desc }) => [desc(projects.createdAt)] // square brackets are required because Drizzle ORM`s orderBy expects an array, even for a single column
  });
};

export const getProjectById = async (id: string) => {
  return db.query.projects.findFirst({
    where: eq(projects.id, id),
    with: { 
      user: true, 
      comments: { 
        with: { user: true },
        orderBy: (comments, { desc }) => [desc(comments.createdAt)]
      },
    },
  });
};

export const getProjectsByUserId = async (userId: string) => {
  return db.query.projects.findMany({
    where: eq(projects.userId, userId),
    with: { user: true },
    orderBy: (projects, { desc }) => [desc(projects.createdAt)],
  });
};

export const updateProject = async (id: string, data: Partial<NewProject>) => {
  const existingProject = await getProjectById(id);
  if (!existingProject) {
    throw new Error(`Project with id ${id} does not exist`);
  }

  const [project] = await db.update(projects).set(data).where(eq(projects.id, id)).returning();
  return project;
};

export const deleteProject = async (id: string) => {
  const existingProject = await getProjectById(id);
  if (!existingProject) {
    throw new Error(`Project with id ${id} does not exist`);
  }

  const [project] = await db.delete(projects).where(eq(projects.id, id)).returning();
  return project;
};

// Task Queries
export const getTasksByProjectId = async (projectId: string, userId: string) => {
  return db.query.tasks.findMany({
    where: and(eq(tasks.projectId, projectId), eq(tasks.userId, userId)),
    orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
  });
};

// Timer Queries
export const getCurrentTimerSession = async (userId: string) => {
  return db.query.timerSessions.findFirst({
    where: and(eq(timerSessions.userId, userId), isNull(timerSessions.endedAt)),
    with: { task: true },
  });
};

export const startTimerSession = async (userId: string, taskId: string) => {
  const existing = await getCurrentTimerSession(userId);
   if (existing) {
     throw new Error("A timer session is already running");
   }
  return db.insert(timerSessions)
    .values({
      userId,
      taskId,
      startedAt: new Date(),
    })
    .returning();
};

export const stopCurrentTimerSession = async (userId: string, durationSec: number) => {
  const now = new Date();
  const [session] = await db.update(timerSessions)
    .set({ endedAt: now, durationSec, updatedAt: now })
    .where(and(eq(timerSessions.userId, userId), isNull(timerSessions.endedAt)))
    .returning();
  if (!session) {
    throw new Error("No active timer session to stop");
  }
  return session;
};




// Comment Queries
export const createComment = async (data: NewComment) => {
  const [comment] = await db.insert(comments).values(data).returning();
  return comment;
};

export const getCommentById = async (id: string) => {
  return db.query.comments.findFirst({
    where: eq(comments.id, id),
    with: { user: true },
  });
};

export const deleteComment = async (id: string) => {
  const existingComment = await getCommentById(id);
  if (!existingComment) {
    throw new Error(`Comment with id ${id} does not exist`);
  }
  
  const [comment] = await db.delete(comments).where(eq(comments.id, id)).returning();
  return comment;
};



