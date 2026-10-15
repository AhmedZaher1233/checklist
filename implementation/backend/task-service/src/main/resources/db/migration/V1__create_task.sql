-- The shared task list (specs/001-todo-list/data-model.md)
CREATE TABLE task (
    id          uuid                     PRIMARY KEY,
    title       varchar(100)             NOT NULL,
    completed   boolean                  NOT NULL DEFAULT false,
    created_at  timestamp(6) with time zone NOT NULL,
    CONSTRAINT ck_task_title_length CHECK (char_length(title) BETWEEN 1 AND 100)
);

CREATE INDEX ix_task_created_at_id ON task (created_at DESC, id DESC);
