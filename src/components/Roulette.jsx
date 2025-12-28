import { useState, useEffect } from 'react';
import questionsData from '../data/questions.json';
import './Roulette.css';

function Roulette() {
  const [questions, setQuestions] = useState(() => {
    // localStorage에서 저장된 데이터가 있으면 사용, 없으면 기본 데이터 사용
    const saved = localStorage.getItem('questions');
    return saved ? JSON.parse(saved) : questionsData;
  });
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // 컴포넌트 마운트 시 questions.json의 최신 데이터를 localStorage에 동기화
    // questions.json이 업데이트되었을 때 반영되도록 함
    localStorage.setItem('questions', JSON.stringify(questionsData));
    setQuestions(questionsData);

    // localStorage 변경 감지
    const handleStorageChange = () => {
      const saved = localStorage.getItem('questions');
      if (saved) {
        setQuestions(JSON.parse(saved));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    // 같은 탭에서의 변경도 감지하기 위해 interval 사용
    const interval = setInterval(() => {
      const saved = localStorage.getItem('questions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (JSON.stringify(parsed) !== JSON.stringify(questions)) {
          setQuestions(parsed);
        }
      }
    }, 500);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const drawQuestion = () => {
    if (isDrawing || questions.length === 0) return;

    setIsDrawing(true);
    setSelectedQuestion('');
    setSelectedNumber(null);
    setShowCelebration(false);

    // 랜덤한 항목 선택
    const randomIndex = Math.floor(Math.random() * questions.length);
    const selectedNum = randomIndex + 1;

    // 뽑기 애니메이션 (1초)
    setTimeout(() => {
      setSelectedNumber(selectedNum);
      setSelectedQuestion(questions[randomIndex]);
      setShowCelebration(true);
      setIsDrawing(false);
      
      // 축하 애니메이션은 3초 후 사라짐
      setTimeout(() => {
        setShowCelebration(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="roulette-container">
      <div className="roulette-header">
        <h1>🎰 소재 가챠 🎰</h1>
        <p className="subtitle">소재를 뽑아보세요!</p>
      </div>

      <button
        className={`draw-button ${isDrawing ? 'drawing' : ''}`}
        onClick={drawQuestion}
        disabled={isDrawing || questions.length === 0}
      >
        {isDrawing ? '뽑는 중...' : '🎲 뽑기!'}
      </button>

      {/* 축하 애니메이션 */}
      {showCelebration && (
        <div className="celebration">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="confetti" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.5}s`,
              backgroundColor: ['#FF6B9D', '#4ECDC4', '#45B7D1', '#F9CA24', '#F0932B', '#EB4D4B', '#6C5CE7', '#A29BFE', '#FD79A8', '#FDCB6E'][Math.floor(Math.random() * 10)]
            }}></div>
          ))}
        </div>
      )}

      {/* 결과 모달 */}
      {selectedQuestion && (
        <div className="result-modal-overlay" onClick={() => {
          setSelectedQuestion('');
          setSelectedNumber(null);
        }}>
          <div className="result-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="result-close-button"
              onClick={() => {
                setSelectedQuestion('');
                setSelectedNumber(null);
              }}
            >
              ✕
            </button>
            <div className="result-content">
              <h2>✨ 결과 ✨</h2>
              <p className="result-number">#{selectedNumber}</p>
              <p className="result-text">{selectedQuestion}</p>
            </div>
          </div>
        </div>
      )}

      {questions.length === 0 && (
        <div className="empty-message">
          <p>소재가 없습니다. 관리 페이지에서 소재를 추가해주세요!</p>
        </div>
      )}
    </div>
  );
}

export default Roulette;
