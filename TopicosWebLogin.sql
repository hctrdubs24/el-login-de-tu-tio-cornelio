-- Active: 1665625104470@@127.0.0.1@3306
DROP DATABASE IF EXISTS TopicosWebLogin;
CREATE DATABASE IF NOT EXISTS TopicosWebLogin
CHARACTER SET = 'latin1'
COLLATE = 'latin1_spanish_ci';
USE TopicosWebLogin;

CREATE TABLE IF NOT EXISTS cNombre(
CvNombre int(3) Auto_Increment Primary Key not null,
DsNombre varchar(20) not null
) ENGINE InnoDB;

INSERT INTO cNombre (CvNombre, DsNombre) values (null, 'Diego'), (null, 'Francisco'),
(null, 'Daniela'), (null, 'Luis');

CREATE TABLE IF NOT EXISTS cApellid(
CvApellid int(3) Auto_Increment Primary Key not null,
DsApellid varchar(20) not null
) ENGINE InnoDB;

INSERT INTO cApellid (CvApellid, DsApellid) values (null, 'Camacho'), (null, 'Espinosa'),
(null, 'Díaz'), (null, 'Hernández'), (null, 'Lara'), (null, 'Cruz'), (null, 'Aguilar'), (null, 'Gomez');

CREATE TABLE IF NOT EXISTS cGenero(
CvGenero int(3) Auto_Increment Primary Key not null,
DsGenero varchar(20) not null
) ENGINE InnoDB;

INSERT INTO cGenero (CvGenero, DsGenero) values (null, 'Masculino'), (null, 'Femenino');

CREATE TABLE IF NOT EXISTS cCalle(
CvCalle int(3) Auto_Increment Primary Key not null,
DsCalle varchar(20) not null
) ENGINE InnoDB;

INSERT INTO cCalle (CvCalle, DsCalle) values (null, 'Benito Juarez'),
(null, 'Reforma'), (null, 'Peñarol'), (null, 'Conde Garay');

CREATE TABLE IF NOT EXISTS cColon(
CvColon int(3) Auto_Increment Primary Key not null,
DsColon varchar(20) not null
) ENGINE InnoDB;

INSERT INTO cColon (CvColon, DsColon) values (null, 'Xalpa'),
(null, 'Cosmopolita'), (null, 'Santa lucia'), (null, 'La libertad');

CREATE TABLE IF NOT EXISTS cMunic(
CvMunic int(3) Auto_Increment Primary Key not null,
DsMunic varchar(20) not null
) ENGINE InnoDB;

INSERT INTO cMunic (CvMunic, DsMunic) values (null, 'San cristobal'), (null, 'Soltepec'), 
(null, 'Novalto'), (null, 'Cordoba');

CREATE TABLE IF NOT EXISTS cEstado(
CvEstado int(3) Auto_Increment Primary Key not null,
DsEstado varchar(20) not null
) ENGINE InnoDB;

INSERT INTO cEstado (CvEstado, DsEstado) values (null, 'Sinaloa'), 
(null, 'Chiapas'), (null, 'Veracuz'), (null, 'Puebla');

CREATE TABLE IF NOT EXISTS cTipoPerso(
CvTipoPerso int(3) Auto_Increment Primary Key not null,
DsTipoPerso varchar(20) not null
)ENGINE InnoDB;

INSERT INTO cTipoPerso (CvTipoPerso, DsTipoPerso) values (null, 'Empleado'),
(null, 'Administrador'), (null, 'Proveedor'), (null, 'Cliente');

CREATE TABLE IF NOT EXISTS mDirecc(
CvDirecc int(3) Auto_Increment Primary Key not null,
CvCalle int(3) not null,
CvColon int(3) not null,
CvMunic int(3) not null,
CvEstado int(3) not null,
NumExt varchar(6),
CP varchar(5) not null,
constraint D_fk_cCalle foreign key (CvCalle) references cCalle(CvCalle),
constraint D_fk_cColon foreign key (CvColon) references cColon(CvColon),
constraint D_fk_cMunic foreign key (CvMunic) references cMunic(CvMunic),
constraint D_fk_cEstado foreign key (CvEstado) references cEstado(CvEstado)
ON DELETE CASCADE 
ON UPDATE CASCADE
) ENGINE InnoDB;

INSERT INTO mDirecc (CvDirecc, CvCalle, CvColon, CvMunic, CvEstado, NumExt, CP) values (null,2, 4, 3, 1, '17', '89238'),
(null,1, 2, 1, 2, '475', '51363'), (null, 4, 3, 2, 4, '78', '30232'), (null, 3, 1, 4, 3, '398', '30083');

CREATE TABLE IF NOT EXISTS mPerso(
CvPerso int(3) Auto_Increment Primary Key not null,
CvTipoPerso int(3) not null,
CvNombre int(3) not null,
CvApePat int(3) not null,
CvApeMat int(3) not null,
CvGenero int(3) not null,
FecNac varchar(8) not null,
Edad int(5) not null,
RFC varchar(13),
CURP varchar(18) not null,
Telefono varchar(13) not null,
Correo varchar(80),
CvDirecc int(3),
constraint Per_fk_cNombre foreign key (CvNombre) references cNombre(CvNombre),
constraint Per_fk_cTipoPerso foreign key (CvTipoPerso) references cTipoPerso(CvTipoPerso),
constraint Per_fk_cApePat foreign key (CvApePat) references cApellid(CvApellid),
constraint Per_fk_cApeMat foreign key (CvApeMat) references cApellid(CvApellid),
constraint Per_fk_cGenero foreign key (CvGenero) references cGenero(CvGenero),
constraint Per_fk_mDirecc foreign key (CvDirecc) references mDirecc(CvDirecc)
ON DELETE CASCADE 
ON UPDATE CASCADE
)ENGINE InnoDB;

INSERT INTO mPerso (CvPerso, CvTipoPerso, CvNombre, CvApePat, CvApeMat, CvGenero, FecNac, Edad, RFC, CURP, Telefono, Correo, CvDirecc) 
values (null, 1, 1, 1, 1, 1, '01/01/98', 32, 'XDF1889654778', 'SDF188965477887LA7', '963-143-76-88', 'esteañoeselbueno@hotmail.com', 1),
(null, 2, 2, 2, 2, 2, '02/02/99', 25, 'SDF1889654778', 'WEF188965477887LA2', '963-113-45-54', 'daskjs@outlook.com', 2), 
(null, 3, 3, 3, 3, 1, '03/03/00', 26, 'ASF1889654778', 'AHF188965477887LA8', '963-114-67-73', 'jfkMaster@hotmail.com', 3), 
(null, 4, 4, 4, 4, 2, '04/04/01', 23, 'HFF1889654778', 'HTF188965477887LA3', '963-117-43-56', 'fgmovil@gmail.com', 4);

CREATE TABLE IF NOT EXISTS mUsuario(
CvUser int(3) Auto_Increment Primary Key not null,
CvPerso int(3) not null,
NomUser varchar(10) not null,
Contrasena varchar(10) not null,
FechaIni DATE,
FechaFin DATE,
EdoCta BOOLEAN,
constraint Usr_fk_cPerso foreign key (CvPerso) references mPerso(CvPerso)
ON DELETE CASCADE 
ON UPDATE CASCADE
)ENGINE InnoDB;

INSERT INTO mUsuario (CvUser, CvPerso, NomUser, Contrasena, FechaIni, FechaFin, EdoCta) values
(null, 1, 'nego', '123456', '2022-03-24', '2022-07-14', true),
(null, 2, 'fran69', '666uwu', '2022-03-24', '2022-03-24', true),
(null, 3, 'dani96', 'owo16', '2022-03-24', '2022-03-24', true);
