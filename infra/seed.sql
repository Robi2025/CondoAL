insert into units(code, owner_name) values
('Depto 101','JUAN PEREZ') on conflict do nothing,
('Depto 102','MARIA TORRES') on conflict do nothing,
('Depto 305','MARTA LOPEZ') on conflict do nothing;
