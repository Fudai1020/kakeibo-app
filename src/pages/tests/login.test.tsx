import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../Login';
import '@testing-library/jest-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';

jest.mock('firebase/auth',()=>{
  return{
    getAuth:jest.fn(),
    signInWithEmailAndPassword:jest.fn(),
  }
});
beforeAll(()=>{
  window.alert = jest.fn();
});

describe('Login Page', () => {
  it('ログインが表示される', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const loginButton = screen.getByRole('button', { name: /ログイン/i });
    expect(loginButton).toBeInTheDocument();
  });
  it('メールアドレスを入力できるか',()=>{
    render(
        <MemoryRouter>
            <Login/>
        </MemoryRouter>
    );
    const emailInput = screen.getByPlaceholderText('メールアドレス');
    fireEvent.change(emailInput,{target:{value:'sample@test.com'}});
    expect(emailInput).toHaveValue('sample@test.com');
  });
    it('パスワードを入力できるか',()=>{
    render(
        <MemoryRouter>
            <Login/>
        </MemoryRouter>
    );
    const passwordInput = screen.getByPlaceholderText('パスワード');
    fireEvent.change(passwordInput,{target:{value:'test1234'}});
    expect(passwordInput).toHaveValue('test1234');
  });
  it('ログインボタンを押すとsignInWithEmailPasswordが呼ばれるか',async()=>{
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({user:{uid:'dummyUid'}});
    render(
        <MemoryRouter>
            <Login/>
        </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText('メールアドレス'),{
        target:{value:'sample@test.com'},
    });
    fireEvent.change(screen.getByPlaceholderText('パスワード'),{
        target:{value:'test1234'},
    });
    fireEvent.click(screen.getByRole('button',{name:'ログイン'}));
    await waitFor(()=>{
      expect(signInWithEmailAndPassword).toHaveBeenCalled();
    });
  });
});
