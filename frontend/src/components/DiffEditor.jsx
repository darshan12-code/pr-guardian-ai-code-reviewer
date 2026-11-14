import { useRef, useState } from "react";
import styled from "styled-components";
import {
  Panel,
  PanelHeader,
  PanelBody,
  Heading,
  Description,
  Button,
} from "../styles/components";

const Editor = styled.textarea`
  width: 100%;
  min-height: 260px;
  resize: vertical;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.medium};
  padding: 16px;

  background: #0F172A;
  color: #E2E8F0;

  font-family: "Consolas", "Courier New", monospace;
  font-size: 12px;
  line-height: 1.8;

  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }

  &::placeholder {
    color: #64748B;
  }
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 14px;
`;

const ToolbarGroup = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 9px;
`;

const CharacterCount = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const HiddenInput = styled.input`
  display: none;
`;

const sampleDiff = `diff --git a/users.py b/users.py
--- a/users.py
+++ b/users.py
@@ -1,2 +1,4 @@
 def get_user(user_id):
-    return db.get_user(user_id)
+    query = "SELECT * FROM users WHERE id = " + user_id
+    cursor.execute(query)
+    return eval(query)
`;

function DiffEditor({ diff, setDiff, onReview, loading }) {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!/\.(diff|patch)$/i.test(file.name)) {
      alert("Please upload a .diff or .patch file.");
      event.target.value = "";
      return;
    }

    if (file.size > 50000) {
      alert("File is too large. Maximum size is 50 KB.");
      event.target.value = "";
      return;
    }

    try {
      const content = await file.text();
      setDiff(content);
      setFileName(file.name);
    } catch {
      alert("Unable to read the selected file.");
    }

    event.target.value = "";
  };

  const loadSample = () => {
    setDiff(sampleDiff);
    setFileName("sample-vulnerable.diff");
  };

  const clearEditor = () => {
    setDiff("");
    setFileName("");
  };

  return (
    <Panel>
      <PanelHeader>
        <div>
          <Heading>Submit your Git diff</Heading>
          <Description>
            Paste your unified Git diff or upload a patch file.
          </Description>
        </div>

        <Button
          $variant="secondary"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
        >
          ↑ Upload diff
        </Button>

        <HiddenInput
          ref={fileInputRef}
          type="file"
          accept=".diff,.patch"
          onChange={handleFileUpload}
        />
      </PanelHeader>

      <PanelBody>
        <Toolbar>
          <ToolbarGroup>
            <Button
              $variant="secondary"
              onClick={loadSample}
              disabled={loading}
            >
              Load sample
            </Button>

            <Button
              $variant="secondary"
              onClick={clearEditor}
              disabled={loading}
            >
              Clear
            </Button>
          </ToolbarGroup>

          <CharacterCount>
            {fileName ? `${fileName} · ` : ""}
            {diff.length.toLocaleString()} / 50,000 characters
          </CharacterCount>
        </Toolbar>

        <Editor
          value={diff}
          onChange={(event) => {
            setDiff(event.target.value);
            setFileName("");
          }}
          placeholder={`diff --git a/example.py b/example.py
--- a/example.py
+++ b/example.py
@@ -1,2 +1,3 @@
 existing code
- old code
+ new code`}
          spellCheck={false}
          maxLength={50000}
          disabled={loading}
        />

        <Toolbar style={{ marginTop: "16px", marginBottom: 0 }}>
          <CharacterCount>
            Only added lines will be used for finding locations.
          </CharacterCount>

          <Button
            onClick={onReview}
            disabled={loading || !diff.trim()}
          >
            {loading ? "Reviewing changes..." : "✦ Review code"}
          </Button>
        </Toolbar>
      </PanelBody>
    </Panel>
  );
}

export default DiffEditor;