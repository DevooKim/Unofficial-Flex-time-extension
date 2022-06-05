const getUserName = (): string => {
    const nameElement = Array.from(
        document.getElementsByClassName("c-lmMdX c-lmMdX-idVXNkw-css")
    ); //이름, 회사명
    const name = nameElement[0].textContent;
    return name || "";
};
export { getUserName };
