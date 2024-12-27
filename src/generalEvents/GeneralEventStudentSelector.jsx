import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import getApiUrl from "../util/api";

const GeneralEventStudentSelector = ({
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
    <Form className="mt-4">
      <Form.Group className="mb-3">
        <Form.Label>Selecione o nível</Form.Label>
        <Form.Select
          value={selectedLevel || ""}
          onChange={onLevelChange}
        >
          <option value="">Selecione...</option>
          {levels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Selecione o grupo</Form.Label>
        <Form.Select
          value={selectedGroup?.id || ""}
          onChange={onGroupChange}
          disabled={!selectedLevel}
        >
          <option value="">Selecione...</option>
          {groups
            .filter((group) => group.level === selectedLevel)
            .map((group) => (
              <option key={group.id} value={group.id}>
                {group.name} - {group.shift}
              </option>
            ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Selecione o estudante</Form.Label>
        <Form.Select
          value={selectedStudent?.registration || ""}
          onChange={onStudentChange}
          disabled={!selectedGroup}
        >
          <option value="">Selecione...</option>
          {groupStudents.map((student) => (
            <option key={student.registration} value={student.registration}>
              {student.name} - {student.responsible}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Button
        variant="primary"
        onClick={onAddStudent}
        disabled={!selectedStudent}
      >
        Adicionar estudante
      </Button>
    </Form>
  );
};

export default GeneralEventStudentSelector;
