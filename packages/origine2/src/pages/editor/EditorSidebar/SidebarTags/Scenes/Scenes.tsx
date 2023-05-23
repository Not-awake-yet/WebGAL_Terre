import styles from "../sidebarTags.module.scss";
import { useValue } from "../../../../../hooks/useValue";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../store/origineStore";
import axios from "axios";
import { IFileInfo } from "webgal-terre-2/dist/Modules/webgal-fs/webgal-fs.service";
import FileElement from "../../sidebarComponents/FileElement";
import { Callout, PrimaryButton, Text, TextField } from "@fluentui/react";
import { ITag, statusActions } from "../../../../../store/statusReducer";
import useTrans from "@/hooks/useTrans";

export default function Scenes() {
  const t = useTrans('editor.sideBar.scenes.');
  const state = useSelector((state: RootState) => state.status.editor);
  const dispatch = useDispatch();
  const currentGameName = state.currentEditingGame;
  // 场景文件的列表
  const sceneList = useValue<IFileInfo[]>([]);

  // 处理新建场景的问题
  const showCreateSceneCallout = useValue(false);
  const newSceneName = useValue("");
  const updateNewSceneName = (event: any) => {
    const newValue = event.target.value;
    newSceneName.set(newValue);
  };
  const createNewScene = () => {
    const gameName = state.currentEditingGame;
    const params = new URLSearchParams();
    params.append("gameName", gameName);
    params.append("sceneName", newSceneName.value);
    axios.post("/api/manageGame/createNewScene/", params).then(() => {
      showCreateSceneCallout.set(false);
      updateSceneListView();
      newSceneName.set("");
    });
  };

  // 请求场景文件的函数
  async function getSceneList() {
    const url = `/api/manageGame/readGameAssets/${currentGameName}/game/scene`;
    const rawSceneList: IFileInfo[] = await axios.get(url).then((r) => r.data.dirInfo);
    return rawSceneList.filter((e: any) => e.extName === ".txt");
  }

  function updateSceneListView() {
    getSceneList().then((result) => {
      sceneList.set(result);
    });
  }

  // 准备请求场景文件
  useEffect(() => {
    updateSceneListView();
  }, []);

  // 更新文件名的函数
  function constructUpdateFilenameFunc(oldPath: string) {
    return function(newFilename: string) {
      const params = new URLSearchParams();
      params.append("path", oldPath);
      params.append("newName", newFilename);
      axios.post("/api/manageGame/editFilename/", params).then(updateSceneListView);
    };
  }

  // 删除文件的函数
  function constructDeleteFileFunc(path: string) {
    return function() {
      const params = new URLSearchParams();
      params.append("path", path);
      axios.post("/api/manageGame/deleteFile/", params).then(updateSceneListView);
    };
  }

  // 添加 Tag 的函数
  function addEditTag(name: string, target: string) {
    const tag: ITag = { tagName: name, tagTarget: target, tagType: "scene" };
    // 先要确定没有这个tag
    const result = state.tags.findIndex((e) => e.tagTarget === target);
    if (result < 0) dispatch(statusActions.addEditAreaTag(tag));
    dispatch(statusActions.setCurrentTagTarget(target));
  }

  const showSceneList = sceneList.value.map((singleFile) => {
    return (
      <FileElement
        clickCallback={() => addEditTag(singleFile.name, singleFile.path)}
        name={singleFile.name}
        key={singleFile.name}
        deleteCallback={constructDeleteFileFunc(singleFile.path)}
        editFileNameCallback={constructUpdateFilenameFunc(singleFile.path)}
      />
    );
  });

  return (
    <div style={{ height: "100%", overflow: "auto" }}>
      <div className={styles.sidebar_tag_head}>
        <div className={styles.sidebar_tag_title}>{t('title')}</div>
        <div className={styles.sidebar_tag_head_button}>
          <PrimaryButton
            id="createSceneButton"
            text={t('dialogs.create.button')}
            onClick={() => showCreateSceneCallout.set(!showCreateSceneCallout.value)}
          />
          {showCreateSceneCallout.value && (
            <Callout
              className={styles.callout}
              ariaLabelledBy="createNewSceneCallout"
              ariaDescribedBy="createNewSceneCallout"
              role="dialog"
              gapSpace={0}
              target="#createSceneButton"
              onDismiss={() => {
                showCreateSceneCallout.set(false);
              }}
              setInitialFocus
              style={{ width: "300px", padding: "5px 10px 5px 10px" }}
            >
              <Text block variant="xLarge" className={styles.title}>
                {t('dialogs.create.title')}
              </Text>
              <div>
                <TextField defaultValue={newSceneName.value} onChange={updateNewSceneName} label={t('dialogs.create.text')} />
              </div>
              <div style={{ display: "flex", justifyContent: "center", padding: "5px 0 5px 0" }}>
                <PrimaryButton text={t('$common.create')} onClick={createNewScene} allowDisabledFocus />
              </div>
            </Callout>
          )}
        </div>
      </div>
      <div style={{ overflow: "auto", maxHeight: "calc(100% - 45px)" }}>{showSceneList}</div>
    </div>
  );
}
