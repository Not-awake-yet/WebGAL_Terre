import styles from './templateEditorMainAria.module.scss';
import { useTemplateEditorContext } from '@/store/useTemplateEditorStore';
import TemplateEditorToolbar from './TemplateEditorToolbar';
import TemplateGraphicalEditor from '../TemplateGraphicalEditor/TemplateGraphicalEditor';
import TemplatePreview from './TemplatePreview';
import TabsManager from './TabsManager';
import TextEditor from '@/pages/templateEditor/TextEditor/TextEditor';

export default function TemplateMainAria() {

  const currentTab = useTemplateEditorContext((state) => state.currentTab);
  const isCodeMode = useTemplateEditorContext((state) => state.isCodeMode);

  return (
    <div className={styles.mainAria}>
      <TemplatePreview />
      <div className={styles.editor}>
        <TabsManager />
        <div className={styles.editorContent}>
          {
            currentTab?.path &&
            (isCodeMode
              ? <TextEditor path={currentTab?.path} key={currentTab?.path + currentTab?.class} /> 
              : <TemplateGraphicalEditor />
            )
          }
        </div>
        <TemplateEditorToolbar />
      </div>
    </div>
  );
}