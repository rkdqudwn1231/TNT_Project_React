import React, { useEffect, useRef, useState } from 'react';
import styles from './Chatbot.module.css';
import { caxios } from '../../config/config';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { FaXmark } from "react-icons/fa6";
import { AiFillHome } from "react-icons/ai";
import { RiNotification2Fill } from "react-icons/ri";
import { IoChatboxEllipsesSharp } from "react-icons/io5";
import { GiClothes } from "react-icons/gi";
import { MdOutlineCleaningServices } from "react-icons/md";

const Chatbot = () => {
    const [activeTab, setActiveTab] = useState("home");  // ← 탭 상태
    const [messages, setMessages] = useState([{
        text: "당신의 퍼스널 컬러와 체형에 맞는 스타일을 추천해드립니다. 궁금한 점을 말해보세요.",
        sender: "bot"
    }]);
    const [inputValue, setInputValue] = useState("");
    const [isOpen, setIsOpen] = useState(false); //창 껐다 키기용

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const [chatLoading, setChatLoading] = useState(false);

    const messagesEndRef = useRef(null); //메세지 최하단으로 위치하게 하기 용도.

    useEffect(() => {
        const handler = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener("resize", handler); // 창 크기 바뀔때마다 적용
        return () => window.removeEventListener("resize", handler); // 이벤트 정리 ( 중복 방지 )
    }, []);

    const MessageList = React.memo(({ messages, chatLoading }) => (
        <>
            {messages.map((msg, i) => (
                <div key={i} className={msg.sender === "user" ? styles.userMessage : styles.botMessage}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.text}
                    </ReactMarkdown>
                </div>
            ))}
            {chatLoading && (
                <div className={`${styles.botMessage} ${styles.loadingDots}`}>
                    스타일 추천을 분석 중입니다
                </div>
            )}
        </>
    ));

    const handleSendMessage = async (message) => {
        if (message == "") {
            return false;
        }

        setChatLoading(true);
        setMessages((prev) => [...prev, { text: message, sender: 'user' }]);
        try {
            const token = sessionStorage.getItem('token');
            const res = await caxios.post("/chatbot/ask", {
                userId: token, prompt: message
            });
            // 💡 수정된 부분: res.data (객체)에서 .answer 키의 값 (문자열)을 추출
            const botAnswer = res.data.answer;
            setMessages((prev) => [...prev, { text: botAnswer, sender: 'bot' }]);
        } catch (err) {
            console.error(err + "caxios 에러");
            setMessages((prev) => [...prev, { text: "오류 발생", sender: 'bot' }]);
        }
        setChatLoading(false);
    };

    //메세지 스크롤 최하단으로 이동
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className={isMobile ? styles.mobileWrapper : styles.pcWrapper}>

            {/* 챗봇 버튼 */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={styles.chatbotBtn}
            >
                {isOpen ? <FaXmark /> : <IoChatbubbleEllipsesOutline />}
            </button>

            {/* 챗봇 창 */}
            {isOpen && (
                <div className={styles.chatbotContainer}>

                    <div className={styles.contentArea}>
                        {activeTab === "home" && (
                            <div className={styles.homeView}>
                                <h3>AI 스타일 추천 홈</h3>
                                <p>개인 설정, 스타일 키워드, 최근 질문 이런 것들 넣으면 됨</p>
                            </div>
                        )}

                        {activeTab === "chat" && (
                            <div className={styles.chatContainer}>
                                <div className={styles.contentHeader}>
                                    <div className={styles.contentTitle}>
                                        <GiClothes /> 스타일 챗봇
                                    </div>
                                    <button className={styles.contentTitleBtn}>
                                        <MdOutlineCleaningServices />
                                    </button>

                                </div>
                                <div className={styles.chatWindow}>
                                    <MessageList messages={messages} chatLoading={chatLoading} />
                                    <div ref={messagesEndRef} style={{ display: "inline-block" }} />
                                </div>

                                <div className={styles.inputArea}>
                                    <input
                                        placeholder='스타일을 AI에게 질문해보세요'
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleSendMessage(inputValue);
                                                setInputValue("");
                                            }
                                        }}
                                        readOnly={chatLoading}
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === "notification" && (
                            <div className={styles.notificationWindow}>
                                test
                                test
                                test
                            </div>

                        )}
                    </div>
                    <div className={styles.tabMenu}>
                        <button
                            className={activeTab === "home" ? styles.activeTab : ""}
                            onClick={() => setActiveTab("home")}
                        >
                            <AiFillHome style={{ fontSize: "21px" }} />
                            <br />
                            홈
                        </button>

                        <button
                            className={activeTab === "chat" ? styles.activeTab : ""}
                            onClick={() => setActiveTab("chat")}
                        >
                            <IoChatboxEllipsesSharp style={{ fontSize: "21px" }} />
                            <br />
                            채팅
                        </button>
                        <button
                            className={activeTab === "notification" ? styles.activeTab : ""}
                            onClick={() => setActiveTab("notification")}
                        >
                            <RiNotification2Fill style={{ fontSize: "21px" }} />
                            <br />
                            알림
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Chatbot;
