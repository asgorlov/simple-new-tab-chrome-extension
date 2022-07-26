import React, {ChangeEvent, FC, MouseEvent, useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    loadDataFromStorage,
    offCheckbox,
    onCheckbox,
    selectDarkMode,
    selectSearchEngine,
    setSearchEngine
} from "../store/new-tab.slice";
import {useTranslation} from "react-i18next";
import {AppDispatch} from "../store/store";
import NewTabComponent from "./new-tab.component";

const NewTabContainer: FC = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const isDarkMode = useSelector(selectDarkMode);
    const searchEngine = useSelector(selectSearchEngine);

    useEffect(() => {
        document.title = t("tabTitle");
        dispatch(loadDataFromStorage());
    }, [dispatch, t]);

    const checkboxChangeHandler = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            dispatch(e.target.checked ? onCheckbox() : offCheckbox());

            if (chrome?.storage) {
                chrome.storage.sync.set({isDarkMode: e.target.checked});
            }
        }, [dispatch]
    );

    const buttonClickHandler = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            const target = e.target as HTMLButtonElement;
            dispatch(setSearchEngine(target.value));

            if (chrome?.storage) {
                chrome.storage.sync.set({searchEngine: target.value});
            }
        }, [dispatch]);

    return (
        (isDarkMode !== undefined && searchEngine !== undefined)
            ? <NewTabComponent
                isDarkMode={isDarkMode}
                searchEngine={searchEngine}
                onChange={checkboxChangeHandler}
                onClick={buttonClickHandler}
            />
            : <></>
    );
};

export default NewTabContainer;
