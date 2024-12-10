import React from "react";
import { Form, Button } from "react-bootstrap";

const StudentSelector = ({
  levels,
  groups,
  groupStudents,
  selectedLevel,
  selectedGroup,
  selectedStudent,
  onLevelChange,
  onGroupChange,
  onStudentChange,
  onAddStudent,
}) => {
  return (
    <Form className="mt-3">
      <Form.Group className="mb-3">
        <Form.Label>Selecione o nível</Form.Label>
        <Form.Select value={selectedLevel} onChange={onLevelChange}>
          <option value="">Selecione...</option>
          {levels.map((level, index) => (
            <option key={index} value={level}>
              {level}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Selecione o grupo</Form.Label>
        <Form.Select
          value={selectedGroup}
          onChange={onGroupChange}
          disabled={!selectedLevel}
        >
          <option value="">Selecione...</option>
          {groups
            .filter((group) => group.level === selectedLevel) // Corrige a verificação para usar 'level'
            .map((group) => (
              <option key={group.id} value={group.id}>
                {group.name} - {group.shift}
              </option>
            ))}

        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Selecione o aluno</Form.Label>
        <Form.Select
          value={selectedStudent}
          onChange={onStudentChange}
          disabled={!selectedGroup}
        >
          <option value="">Selecione...</option>
          {groupStudents.map((student) => (
            <option key={student.Registration} value={student.Registration}>
              {student.Name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Button
        onClick={onAddStudent}
        disabled={!selectedStudent}
        variant="primary"
      >
        Adicionar aluno
      </Button>
    </Form>
  );
};

export default StudentSelector;
