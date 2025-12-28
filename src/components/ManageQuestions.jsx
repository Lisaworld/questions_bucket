import { useState, useEffect } from 'react';
import questionsData from '../data/questions.json';
import './ManageQuestions.css';

function ManageQuestions() {
  const [questions, setQuestions] = useState(() => {
    // localStorage에서 저장된 데이터가 있으면 사용, 없으면 기본 데이터 사용
    const saved = localStorage.getItem('questions');
    return saved ? JSON.parse(saved) : questionsData;
  });
  const [newQuestion, setNewQuestion] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    // 컴포넌트 마운트 시 questions.json의 최신 데이터를 localStorage에 동기화
    // questions.json이 업데이트되었을 때 반영되도록 함
    localStorage.setItem('questions', JSON.stringify(questionsData));
    setQuestions(questionsData);
  }, []);

  const saveQuestions = (updatedQuestions) => {
    try {
      // localStorage에 저장
      localStorage.setItem('questions', JSON.stringify(updatedQuestions));
      
      // JSON 파일 다운로드 기능 추가
      const dataStr = JSON.stringify(updatedQuestions, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'questions.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setQuestions(updatedQuestions);
      
      // 성공 메시지 (다운로드 안내는 제거)
      setTimeout(() => {
        alert('소재가 저장되었습니다!\n\nquestions.json 파일이 자동으로 다운로드되었습니다.\n이 파일을 src/data/questions.json으로 교체하시면 영구 저장됩니다.');
      }, 100);
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다.');
    }
  };

  const addQuestion = () => {
    if (newQuestion.trim() === '') {
      alert('소재를 입력해주세요!');
      return;
    }

    const updatedQuestions = [...questions, newQuestion.trim()];
    saveQuestions(updatedQuestions);
    setNewQuestion('');
  };

  const deleteQuestion = (index) => {
    if (window.confirm('이 소재를 삭제하시겠습니까?')) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      saveQuestions(updatedQuestions);
    }
  };

  const startEdit = (index) => {
    setEditingIndex(index);
    setEditText(questions[index]);
  };

  const saveEdit = () => {
    if (editText.trim() === '') {
      alert('소재를 입력해주세요!');
      return;
    }

    const updatedQuestions = [...questions];
    updatedQuestions[editingIndex] = editText.trim();
    saveQuestions(updatedQuestions);
    setEditingIndex(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditText('');
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <div className="manage-container">
      <div className="manage-header">
        <h1>📝 소재 관리</h1>
        <p className="subtitle">소재를 추가, 수정, 삭제할 수 있습니다</p>
      </div>

      <div className="add-section">
        <h2>➕ 새 소재 추가</h2>
        <div className="input-group">
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, addQuestion)}
            placeholder="소재를 입력하세요..."
            className="question-input"
          />
          <button onClick={addQuestion} className="add-button">
            추가
          </button>
        </div>
      </div>

      <div className="questions-section">
        <h2>📋 소재 목록 ({questions.length}개)</h2>
        <div className="questions-list">
          {questions.length === 0 ? (
            <div className="empty-list">
              <p>소재가 없습니다. 위에서 소재를 추가해주세요!</p>
            </div>
          ) : (
            questions.map((question, index) => (
              <div key={index} className="question-item">
                {editingIndex === index ? (
                  <div className="edit-mode">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, saveEdit)}
                      className="edit-input"
                      autoFocus
                    />
                    <div className="edit-buttons">
                      <button onClick={saveEdit} className="save-button">
                        저장
                      </button>
                      <button onClick={cancelEdit} className="cancel-button">
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="question-number">{index + 1}</span>
                    <span className="question-text">{question}</span>
                    <div className="item-actions">
                      <button
                        onClick={() => startEdit(index)}
                        className="edit-button"
                        title="수정"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteQuestion(index)}
                        className="delete-button"
                        title="삭제"
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="info-box">
        <p>💡 <strong>참고사항:</strong></p>
        <p>브라우저를 새로고침하면 원본 데이터로 돌아갑니다.</p>
        <p>영구 저장을 위해서는 <code>src/data/questions.json</code> 파일을 직접 수정해주세요.</p>
      </div>
    </div>
  );
}

export default ManageQuestions;

