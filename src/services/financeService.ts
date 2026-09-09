import {
  db,
  collection,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  uploadFileToStorage,
  getFriendlyFirebaseErrorMessage,
} from '../lib/firebase';
import { Expense, Income, SavingsGoal, ExpenseCategory, IncomeSource } from '../types';

/**
 * Add expense to Firestore with optional receipt image in Firebase Storage
 */
export async function addExpenseToFirestore(
  userId: string,
  data: {
    amount: number;
    category: ExpenseCategory;
    date: string;
    note: string;
    receiptFileOrUrl?: File | string;
  }
): Promise<Expense> {
  try {
    let receiptUrl = '';
    if (data.receiptFileOrUrl) {
      receiptUrl = await uploadFileToStorage(
        `receipts/${userId}/${Date.now()}_receipt`,
        data.receiptFileOrUrl
      );
    }

    const nowIso = new Date().toISOString();
    const expenseDocRef = doc(collection(db, 'expenses'));
    const newExpense: Expense = {
      id: expenseDocRef.id,
      userId,
      amount: Number(data.amount),
      category: data.category,
      date: data.date || nowIso.split('T')[0],
      note: data.note || '',
      receiptUrl: receiptUrl || undefined,
      createdAt: nowIso,
    };

    await setDoc(expenseDocRef, newExpense);
    return newExpense;
  } catch (error) {
    console.error('Failed to add expense:', error);
    throw new Error(getFriendlyFirebaseErrorMessage(error));
  }
}

/**
 * Delete expense from Firestore
 */
export async function deleteExpenseFromFirestore(expenseId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'expenses', expenseId));
  } catch (error) {
    console.error('Failed to delete expense:', error);
    throw new Error(getFriendlyFirebaseErrorMessage(error));
  }
}

/**
 * Add income to Firestore
 */
export async function addIncomeToFirestore(
  userId: string,
  data: {
    amount: number;
    source: IncomeSource;
    date: string;
    note: string;
  }
): Promise<Income> {
  try {
    const nowIso = new Date().toISOString();
    const incomeDocRef = doc(collection(db, 'income'));
    const newIncome: Income = {
      id: incomeDocRef.id,
      userId,
      amount: Number(data.amount),
      source: data.source,
      date: data.date || nowIso.split('T')[0],
      note: data.note || '',
      createdAt: nowIso,
    };

    await setDoc(incomeDocRef, newIncome);
    return newIncome;
  } catch (error) {
    console.error('Failed to add income:', error);
    throw new Error(getFriendlyFirebaseErrorMessage(error));
  }
}

/**
 * Delete income from Firestore
 */
export async function deleteIncomeFromFirestore(incomeId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'income', incomeId));
  } catch (error) {
    console.error('Failed to delete income:', error);
    throw new Error(getFriendlyFirebaseErrorMessage(error));
  }
}

/**
 * Add savings goal to Firestore
 */
export async function addSavingsGoalToFirestore(
  userId: string,
  data: {
    title: string;
    targetAmount: number;
    savedAmount?: number;
    category: string;
    targetDate?: string;
  }
): Promise<SavingsGoal> {
  try {
    const nowIso = new Date().toISOString();
    const goalDocRef = doc(collection(db, 'savingsGoals'));
    const newGoal: SavingsGoal = {
      id: goalDocRef.id,
      userId,
      title: data.title,
      targetAmount: Number(data.targetAmount),
      savedAmount: Number(data.savedAmount || 0),
      category: data.category,
      targetDate: data.targetDate,
      createdAt: nowIso,
    };

    await setDoc(goalDocRef, newGoal);
    return newGoal;
  } catch (error) {
    console.error('Failed to add savings goal:', error);
    throw new Error(getFriendlyFirebaseErrorMessage(error));
  }
}

/**
 * Add funds to a savings goal
 */
export async function addFundsToSavingsGoal(
  goalId: string,
  currentSaved: number,
  additionalAmount: number
): Promise<number> {
  try {
    const newSaved = currentSaved + Number(additionalAmount);
    await updateDoc(doc(db, 'savingsGoals', goalId), {
      savedAmount: newSaved,
      updatedAt: new Date().toISOString(),
    });
    return newSaved;
  } catch (error) {
    console.error('Failed to update savings goal:', error);
    throw new Error(getFriendlyFirebaseErrorMessage(error));
  }
}

/**
 * Update savings goal
 */
export async function updateSavingsGoalInFirestore(
  goalId: string,
  updates: Partial<SavingsGoal>
): Promise<void> {
  try {
    const cleanUpdates: Record<string, unknown> = {};
    if (updates.title !== undefined) cleanUpdates.title = updates.title;
    if (updates.targetAmount !== undefined) cleanUpdates.targetAmount = Number(updates.targetAmount);
    if (updates.savedAmount !== undefined) cleanUpdates.savedAmount = Number(updates.savedAmount);
    if (updates.category !== undefined) cleanUpdates.category = updates.category;
    if (updates.targetDate !== undefined) cleanUpdates.targetDate = updates.targetDate;
    cleanUpdates.updatedAt = new Date().toISOString();

    await updateDoc(doc(db, 'savingsGoals', goalId), cleanUpdates);
  } catch (error) {
    console.error('Failed to update goal:', error);
    throw new Error(getFriendlyFirebaseErrorMessage(error));
  }
}

/**
 * Delete savings goal from Firestore
 */
export async function deleteSavingsGoalFromFirestore(goalId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'savingsGoals', goalId));
  } catch (error) {
    console.error('Failed to delete goal:', error);
    throw new Error(getFriendlyFirebaseErrorMessage(error));
  }
}

/**
 * Subscribe to user expenses from Firestore
 */
export function subscribeToUserExpenses(
  userId: string,
  callback: (expenses: Expense[]) => void
) {
  const q = query(
    collection(db, 'expenses'),
    where('userId', '==', userId),
    limit(100)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const list: Expense[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data(), id: docSnap.id } as Expense);
      });
      // Sort client-side to prevent composite index issues
      list.sort((a, b) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime());
      callback(list);
    },
    (err) => {
      console.warn('Firestore expenses listener notice:', err);
    }
  );
}

/**
 * Subscribe to user income from Firestore
 */
export function subscribeToUserIncome(
  userId: string,
  callback: (incomes: Income[]) => void
) {
  const q = query(
    collection(db, 'income'),
    where('userId', '==', userId),
    limit(100)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const list: Income[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data(), id: docSnap.id } as Income);
      });
      list.sort((a, b) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime());
      callback(list);
    },
    (err) => {
      console.warn('Firestore income listener notice:', err);
    }
  );
}

/**
 * Subscribe to user savings goals from Firestore
 */
export function subscribeToUserSavingsGoals(
  userId: string,
  callback: (goals: SavingsGoal[]) => void
) {
  const q = query(
    collection(db, 'savingsGoals'),
    where('userId', '==', userId),
    limit(50)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const list: SavingsGoal[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data(), id: docSnap.id } as SavingsGoal);
      });
      callback(list);
    },
    (err) => {
      console.warn('Firestore savings goals listener notice:', err);
    }
  );
}
