import { useState } from "react";

const ChatInterFace = ({ infos, summarize, translate, detectedLang, error, loading}) => {
  const [selectedLanguages, setSelectedLanguages] = useState({});
 
  return (
    <div className="chatInterface">
      <h1>AI Text Processor</h1>

      {infos.map((info, index) => (
        <div key={index} className={`info ${info.type}`}>
          {loading && <p>Loading.....</p>}
          {/* Display summarized text if available, otherwise show original text */}
          <p className="chatBoxCont">{info.summarized ? info.text : info.text || ""}</p>
          
          {/* Summarization button */}
          {info.type === "user" && info.text && info.text.length > 150 && !info.summarized && (
            <button onClick={() => summarize(info.text)} disabled={!info.text.trim()}>
              Summarize
            </button>
          )}

           {error && <p>{error}</p>}
           {detectedLang && <p className="detectLang"><strong>Detected Language: </strong>{detectedLang}</p>}   

          {/* Translation section */}
          {info.type === "user" && (
            <div className="buttons">
              <select
                value={selectedLanguages[info.id] || "en"}
                onChange={(e) =>
                  setSelectedLanguages((prev) => ({ ...prev, [info.id]: e.target.value }))
                }
              >
                <option value="en">English</option>
                <option value="tr">Turkish</option>
                <option value="ja">Japanese</option>
                <option value="ru">Russian</option>
                <option value="es">Spanish</option>
              </select>

              <button
                onClick={() => translate(info.text, detectedLang, selectedLanguages[info.id] || "en")}
                disabled={!info.text || !selectedLanguages[info.id]}
              >
                Translate
              </button>
            </div>
          )}

          {/* Show translation result if available */}
          {info.translated && <p className="translatedText"> <strong>Translated to: </strong>{info.translation}</p>}
        </div>
      ))}
    </div>
  );
};

export default ChatInterFace;
