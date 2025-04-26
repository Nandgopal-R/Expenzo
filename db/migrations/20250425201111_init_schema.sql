-- +goose Up
-- +goose StatementBegin
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  amount FLOAT NOT NULL,
  description VARCHAR(1000),
  category VARCHAR(256) NOT NULL,
  createdAt TIMESTAMPTZ DEFAULT NOW()
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE expenses;
-- +goose StatementEnd
