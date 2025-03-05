 /* eslint-disable no-restricted-globals */

import { v4 } from "uuid";
 import { useState } from "react";
 import ChatInterFace from "../components/chat";
 import Text from "../components/textInput";
 
 const Home = () => {
   const [inputText, setInputText] = useState("");
   const [infos, setInfos] = useState([]);
   const [detectedLang, setDetectedLanguage] = useState(""); 
   const [error, setError] = useState(false);
   const [loading, setLoading] = useState(false);
  // const [summarizedLang, setSummarizedLang] = useState('')
 
   const detectLanguage = async (text) => {
     try {
       const available = (await self.ai.languageDetector?.capabilities()).available;
       if (available === "no") {
         setDetectedLanguage("Not Supported");
         setError("Not Supported")
         return "Detection failed";
       }
       
       const detector = await self.ai.languageDetector.create();
       const detectedLanguages = await detector.detect(text);
       const language = detectedLanguages[0]?.detectedLanguage || "Unknown";
 
       setDetectedLanguage(language); // Update UI with detected language
       return language;
     } catch (error) {
       console.error("Error detecting language:", error);
       setDetectedLanguage("Error");
       setError(error)
       return "Detection Error";
     }
   };
 
 
   const summarize = async (text) => {
    try {
      const options = {
        format: "plain-text",
        length: "short",
      };
      const available = (await self.ai.summarizer.capabilities()).available;
  
      if (available === "no") {
        setError("Your device does not support this");
        return;
      }
  
      let summarizer = "";
      if (available === "readily") {
        setLoading(true)
        summarizer = await self.ai.summarizer.create(options);
      } else {
        summarizer = await self.ai.summarizer.create(options);
        summarizer.addEventListener("downloadprogress", (e) => {
          console.log((e.loaded / e.total) * 100);
        });
      }
  
      const response = await summarizer.summarize(text);
      setLoading(false)
      console.log("Summary:", response);

      // setSummarizedLang(response)
  
      setInfos((prev) =>
        prev.map((info) =>
          info.text === text ? { ...info, summarized: true, text: response } : info
        )
      );
    } catch (error) {
      console.error("Error summarizing text:", error);
    }
  };
  
 
 
  const translate = async (text, sourceLanguage, targetLanguage) => {
    try {
      console.log("Attempting to translate:", text, "from", sourceLanguage, "to", targetLanguage);
  
      const available = self.ai.translator?.capabilities?.().available;
  
      if (available === "no") {
        console.error("Translator API is not available.");
        return;
      }
  
      // Check if `languagePairAvailable` exists before calling it
      if (self.ai.translator?.languagePairAvailable) {
        const pairAvailable = await self.ai.translator.languagePairAvailable({
          sourceLanguage,
          targetLanguage,
        });
  
        if (!pairAvailable) {
          console.error("Language pair not supported:", sourceLanguage, targetLanguage);
          setInfos((prev) =>
            prev.map((info) =>
              info.text === text
                ? { ...info, translated: true, translation: "Language pair not supported." }
                : info
            )
          );
          return;
        }
      } else {
        console.warn("languagePairAvailable method is not supported. Skipping check...");
      }
  
      let translator;
      if (available === "readily") {
        translator = await self.ai.translator.create({
          sourceLanguage,
          targetLanguage,
        });
      } else {
        translator = await self.ai.translator.create({
          sourceLanguage,
          targetLanguage,
          monitor(m) {
            m.addEventListener("downloadprogress", (e) => {
              console.log((e.loaded / e.total) * 100);
            });
          },
        });
      }
  
      console.log("Translator created:", translator);
      const response = await translator.translate({ text });
      console.log("Translation response:", response);
  
      // Update only the relevant message
      setInfos((prev) =>
        prev.map((info) =>
          info.text === text ? { ...info, translated: true, translation: response} : info
        )
      );
    } catch (error) {
      console.error("Translation failed:", error);
      setError('Browser not supported')
    }
  };
  
 
 
   async function handleSendInfo() {
    if (!inputText.trim()) return;
  
    const newInfo = { id: v4(), text: inputText, type: "user" }; // Add unique id
    setInfos((prev) => [...prev, newInfo]);
  
    const detectLang = await detectLanguage(inputText);
    // setInfos((prev) => [
    //   ...prev,
    //   { id: v4(), text: `Detected Language: ${detectLang}`, type: "message" }, // Ensure each info has an id
    // ]);
    setDetectedLanguage(detectLang)
  
    setInputText("");
  }
   return (
     <div className="container">
       <h1>AI Text Processor</h1>

       <ChatInterFace infos={infos}  summarize={summarize}  translate={translate} detectedLang={detectedLang} error={error} loading={loading} />
       <Text inputText={inputText} setInputText={setInputText} handleSendInfo={handleSendInfo} />
     </div>
   );
 };
 
 export default Home;
 