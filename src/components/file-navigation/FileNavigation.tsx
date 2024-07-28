import { useState } from 'react';

type File = {
  name: string;
  type: 'file';
};

type Folder = {
  name: string;
  type: 'folder';
  children: Array<File | Folder>;
};

const fileStructure: Array<Folder> = [
  {
    name: 'Root',
    type: 'folder',
    children: [
      {
        name: 'Folder 1',
        type: 'folder',
        children: [
          { name: 'File 1.1', type: 'file' },
          { name: 'File 1.2', type: 'file' },
        ],
      },
      {
        name: 'Folder 2',
        type: 'folder',
        children: [
          { name: 'File 2.1', type: 'file' },
          { name: 'File 2.2', type: 'file' },
        ],
      },
    ],
  },
];

const FileNavigation = ({ structure }: { structure: Array<Folder> }) => {
  const renderTree = (nodes: Array<File | Folder>) => (
    <ul>
      {nodes.map((node) => (
        <li key={node.name}>
          {node.type === 'folder' ? <FolderNode folder={node} /> : <FileNode file={node} />}
        </li>
      ))}
    </ul>
  );

  return <div>{renderTree(structure)}</div>;
};

const FolderNode = ({ folder }: { folder: Folder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);

  const renderTree = (nodes: Array<File | Folder>) => (
    <ul>
      {nodes.map((node) => (
        <li key={node.name}>
          {node.type === 'folder' ? <FolderNode folder={node} /> : <FileNode file={node} />}
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      <div onClick={handleToggle}>{folder.name}</div>
      {isOpen && renderTree(folder.children)}
    </div>
  );
};

const FileNode = ({ file }: { file: File }) => <div>📄 {file.name}</div>;

export default function FileNavigationWrapper() {
  return <FileNavigation structure={fileStructure} />;
}
