import { IAccount } from "@/models/accountModel";
import { signIn, signOut } from "next-auth/react";

export const getAllAccounts = async (): Promise<IAccount[]> => {
    try {
      const response = await fetch("/api/accounts", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch accounts');
      }
  
      const accounts: IAccount[] = await response.json();
  
      if (!accounts) {
        throw new Error('No accounts found.');
      }
  
      return accounts;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unknown error occurred.');
    }
};

export const getAccountById = async (accountId: string): Promise<IAccount> => {
    try {
      const response = await fetch(`/api/accounts/${accountId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch account');
      }
  
      const account: IAccount = await response.json();
      return account;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unknown error occurred.');
    }
};

  

export async function accountLogin(data: { email: string, password: string }) {
    const { email, password } = data;

    const result = await signIn("credentials", {
        redirect: false,
        email,
        password
    });

    if (result?.error) throw new Error("Email or password wrong...");
}


export async function accountLogout() {
    await signOut();
}

export async function accountSignup(newAccount: { name: string, email: string, password: string, passwordConfirm: string }) {
    try {

        const res = await fetch("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({
                name: newAccount.name,
                email: newAccount.email,
                password: newAccount.password,
                passwordConfirm: newAccount.passwordConfirm,
            }),
            headers: {
                "Content-type": "application/json",
            }
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to create a account");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export const updateAccountSettings = async (accountId: string, name: string, email: string): Promise<IAccount> => {
    try {
      const response = await fetch(`/api/accounts/${accountId}/user-settings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update account settings');
      }
  
      const updatedAccount: IAccount = await response.json();
      return updatedAccount;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unknown error occurred.');
    }
  };

export const updatePassword = async ( accountId: string, passwordCurrent: string, newPassword: string, passwordConfirm: string ): Promise<string> => {
    try {
      const response = await fetch(`/api/accounts/${accountId}/update-password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ passwordCurrent, newPassword, passwordConfirm }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update password');
      }
  
      const data = await response.json();
      return data.message;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unknown error occurred.');
    }
};
  

export const deleteAccount = async (): Promise<{ message: string }> => {
    try {
        const res = await fetch(`/api/auth/delete-account`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Failed to delete account');
        }

        return data;
    } catch (error) {
        console.error('Error deleting account:', error);
        throw error;
    }
};