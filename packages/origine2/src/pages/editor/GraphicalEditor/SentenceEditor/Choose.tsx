import { ISentenceEditorProps } from "./index";
import styles from "./sentenceEditor.module.scss";
import { useValue } from "../../../../hooks/useValue";
import { cloneDeep } from "lodash";
import ChooseFile from "../../ChooseFile/ChooseFile";
import { DefaultButton } from "@fluentui/react";
import useTrans from "@/hooks/useTrans";

export default function Choose(props: ISentenceEditorProps) {
  const t = useTrans('editor.graphical.sentences.choose.');
  const chooseItems = useValue(props.sentence.content.split("|").map(e => e.split(":")));

  const submit = () => {
    const chooseItemsStr = chooseItems.value.map(e => e.join(":"));
    const submitStr = chooseItemsStr.join("|");
    props.onSubmit(`choose:${submitStr};`);
  };

  const chooseList = chooseItems.value.map((item, i) => {
    return <div style={{ display: "flex", width:'100%', alignItems: "center",padding:'0 0 4px 0' }} key={i}>
      <DefaultButton onClick={()=>{
        const newList = cloneDeep(chooseItems.value);
        newList.splice(i,1);
        chooseItems.set(newList);
        submit();
      }}>{t('delete')}</DefaultButton>
      <input value={item[0]}
        onChange={(ev) => {
          const newValue = ev.target.value;
          const newList = cloneDeep(chooseItems.value);
          newList[i][0] = newValue;
          chooseItems.set(newList);
        }}
        onBlur={submit}
        className={styles.sayInput}
        placeholder={t('option.name')}
        style={{ width: "50%", margin: "0 6px 0 6px" }}
      />
      {
        item[1] + "\u00a0"
      }
      <ChooseFile sourceBase="scene" onChange={(newFile) => {
        const newValue = newFile?.name ?? "";
        const newList = cloneDeep(chooseItems.value);
        newList[i][1] = newValue;
        chooseItems.set(newList);
        submit();
      }} extName={[".txt"]} />
    </div>;
  });
  return <div className={styles.sentenceEditorContent}>
    {chooseList}
    <DefaultButton onClick={() => {
      const newList = cloneDeep(chooseItems.value);
      newList.push(t('option.option', 'option.chooseFile'));
      chooseItems.set(newList);
      submit();
    }}>{t('add')}</DefaultButton>
  </div>;
}
