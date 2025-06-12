import { useEffect, useState } from 'react';
import '../styles/transactionFormModal.css';
import { addDoc, collection, query, serverTimestamp, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { getAuth } from 'firebase/auth';

type Props = {
  onClose: () => void;
  type: 'income' | 'payment';
  incomeCategories: string[];
  setIncomeCategories: React.Dispatch<React.SetStateAction<string[]>>;
  paymentCategories: string[];
  setPaymentCategories: React.Dispatch<React.SetStateAction<string[]>>;
};

const TransactionFormModal = ({
  onClose,
  type: initialType,
  incomeCategories,
  setIncomeCategories,
  paymentCategories,
  setPaymentCategories
}: Props) => {
  const [view, setView] = useState<'form' | 'category'>('form');
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const [animeClass, setAnimeClass] = useState('');
  const [mainCategoryInput, setMainCategoryInput] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [type, setType] = useState<'income' | 'payment'>(initialType);
  const [amount, setAmount] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [memo, setMemo] = useState('');
  const [date, setDate] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const normalizeAmount = (input: string) => {
    const half = input.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)).replace(/ /g, '');
    const numeric = half.replace(/[^0-9]/g, '');
    return Number(numeric);
  };

  const handleSubmit = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      await addDoc(collection(db, 'users', currentUser.uid, 'transactions'), {
        type,
        amount: normalizeAmount(amount),
        mainCategory: selectedMainCategory,
        subCategory,
        memo,
        date: new Date(date),
        isPrivate,
      });
      alert('登録完了！');
      onClose();
    } catch (e) {
      console.error('保存エラー', e);
      alert('保存に失敗しました');
    }
  };

  const openCategoryModal = () => {
    setSlideDirection('right');
    setAnimeClass('slide-in-right');
    setView('category');
  };

  const closeCategoryModal = () => {
    setSlideDirection('left');
    setAnimeClass('slide-in-left');
    setView('form');
  };

  const addCategory = async (name: string, type: 'income' | 'payment') => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user || !name.trim()) return;

    try {
      await addDoc(collection(db, 'users', user.uid, 'categories'), {
        name,
        type,
        createdAt: serverTimestamp(),
      });

      if (type === 'income') {
        setIncomeCategories(prev => (prev.includes(name) ? prev : [...prev, name]));
      } else {
        setPaymentCategories(prev => (prev.includes(name) ? prev : [...prev, name]));
      }

      setSelectedMainCategory(name);  // 自動選択
      setMainCategoryInput('');       // 入力欄クリア
    } catch (e) {
      console.error('保存エラー', e);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      try {
        const q = query(collection(db, 'users', user.uid, 'categories'), where('type', '==', type));
        const querySnapshot = await getDocs(q);
        const fetchedCategories: string[] = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          if (data.name) {
            fetchedCategories.push(data.name);
          }
        });

        if (type === 'income') {
          setIncomeCategories(fetchedCategories);
        } else {
          setPaymentCategories(fetchedCategories);
        }
      } catch (e) {
        console.error('カテゴリ取得エラー', e);
      }
    };  

    fetchCategories();
  }, [type, setIncomeCategories, setPaymentCategories]);

  const getCurrentMainCategories = () => (type === 'income' ? incomeCategories : paymentCategories);

  return (
    <div className="modal-container">
      {/* フォーム画面 */}
      {view === 'form' && (
        <div className={`content ${animeClass}`}>
          <div className="radio-group">
            <label>
              <input type="radio" value="income" checked={type === 'income'} onChange={() => setType('income')} />
              収入
            </label>
            <label>
              <input type="radio" value="payment" checked={type === 'payment'} onChange={() => setType('payment')} />
              支出
            </label>
          </div>

          <div className="input-amount">
            <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="金額" />
          </div>

          <div className="memo">
            <h2>メモ</h2>
            <textarea value={memo} onChange={(e) => setMemo(e.target.value)} />
          </div>

          <div className="date-lay">
            <h2>日付</h2>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="radio-group">
            <h2>公開設定</h2>
            <label>
              <input type="radio" checked={!isPrivate} onChange={() => setIsPrivate(false)} />
              公開
            </label>
            <label>
              <input type="radio" checked={isPrivate} onChange={() => setIsPrivate(true)} />
              非公開
            </label>
          </div>

          <button className="index-button" onClick={openCategoryModal}>
            項目を追加
          </button>
        </div>
      )}

      {/* カテゴリ選択・追加画面 */}
      {view === 'category' && (
        <div className={`content ${animeClass}`}>
          <div className="category-container">
            <h1 style={{ marginBottom: -15 }}>項目</h1>

            <div className="input-category">
              <h2>カテゴリ名</h2>
              <input type="text" value={subCategory} onChange={(e) => setSubCategory(e.target.value)} />

              <h2 style={{ marginTop: -15 }}>大カテゴリの選択</h2>
              <select value={selectedMainCategory} onChange={(e) => setSelectedMainCategory(e.target.value)}>
                <option value=""></option>
                {getCurrentMainCategories().map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="category-content">
              <h2>新しい大カテゴリを追加</h2>
              <div className="input-with-button">
                <input
                  type="text"
                  value={mainCategoryInput}
                  onChange={(e) => setMainCategoryInput(e.target.value)}
                />
                <button onClick={() => addCategory(mainCategoryInput, type)}>追加</button>
              </div>
            </div>

            <button className="back-button" onClick={closeCategoryModal}>
              戻る
            </button>
            <button className="save-button" onClick={handleSubmit}>
              保存
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionFormModal;
