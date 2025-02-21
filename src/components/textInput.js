import { useState } from "react";

const Text = ({ inputText, setInputText, handleSendInfo }) => {
  const [charCount, setCharCount] = useState(inputText.length);

  const handleChange = (e) => {
    
    const text = e.target.value;
    setInputText(text)
    setCharCount(text.length);
  };

  // Handle Enter key submission
  // function handleKeyPress(e){
  //   e.preventDefault()
  //   if(e.key === "enter" && !e.shiftKey){
  //       handleSendInfo()
  //   }
  // }

  return (
    <div className="textInput">
      <textarea
        maxLength={1500}
        placeholder="Type or paste your text here!"
        value={inputText}
        onChange={handleChange}
        // onKeyDown={handleKeyPress}
        rows={4}
        aria-label="Text input"
      />
      <div className="input-footer">
        <span className="char-count">{charCount}/1500</span>
        <button className="send" onClick={handleSendInfo} disabled={!inputText.trim()}>
          <i className="bi bi-send-check"></i>
        </button>
      </div>
    </div>
  );
};

export default Text;
