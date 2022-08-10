export const getChildByQrCodeQuery = `
SELECT c.id, c.name, c.surname, c.middle_name, c.group_id, 
c.age, c.father_fullname, c.father_phone_number, 
c.father_job_address, c.mother_fullname, 
c.mother_phone_number, 
c.mother_job_address, 
c.phone_number_gender, 
c.child_image, 
c.child_caregiver, 
c.caregiver_phone_number, 
c.kinder_garden_entered_date, 
c.kinder_garden_exited_date, 
c.full_information, 
c.born_certificate_file, 
c.doc_file, 
c.gender, 
c.address, c.created_at, c.updated_at, c.qr_code,g.group_name,g.group_number,
g.group_room
FROM child c
LEFT JOIN group_kinder_garden g ON g.id=c.group_id
WHERE qr_code=$1 LIMIT 1;
`;

export const getLastLogType = `
SELECT child_id, date_log, type as log_type, time_log, is_late, late_duration, is_delivery_sms
	FROM entire_log WHERE child_id=$1 ORDER BY updated_at DESC LIMIT 1;
`;

export const addLogQuery=`
INSERT INTO public.entire_log(
	child_id, date_log, type, time_log, is_late, late_duration, is_delivery_sms, created_at, updated_at)
	VALUES ($1, $2, $3, $4, $5, $6, $7, now(), now()) RETURNING *;
`;

export const loginQuery = `
SELECT id, username, password, fullname, phone_number, kinder_garden_name, kinder_garden_address, created_at, updated_at,user_role
	FROM users WHERE username=$1 AND password=$2;
`;


export const getReportQuery = `
SELECT l.id, 
l.child_id, l.date_log, l.type, 
l.time_log, l.is_late, l.late_duration, 
l.is_delivery_sms, l.created_at, l.updated_at,
c.name,c.surname,c.middle_name,c.father_fullname,c.mother_fullname,c.father_phone_number,c.mother_phone_number,
c.phone_number_gender,c.child_image,c.child_caregiver,c.address,
g.group_name
FROM entire_log l
LEFT JOIN child c ON c.id=l.child_id
LEFT JOIN group_kinder_garden g ON g.id=c.group_id
%s
ORDER BY l.created_at DESC
;
`;

export const getReportNonCame=`
SELECT c.id, c.name, c.surname, c.middle_name, 
c.group_id, c.age, c.father_fullname, c.father_phone_number, 
c.father_job_address, c.mother_fullname, c.mother_phone_number, c.mother_job_address, 
c.phone_number_gender, c.child_image, c.child_caregiver, c.caregiver_phone_number, 
c.kinder_garden_entered_date, c.kinder_garden_exited_date, c.full_information, 
c.born_certificate_file, c.doc_file, c.gender, c.address, c.created_at, c.updated_at, c.qr_code,g.group_name
FROM child c
LEFT JOIN group_kinder_garden g ON g.id=c.group_id
WHERE c.id NOT IN (SELECT l.child_id FROM entire_log l WHERE to_char(l.created_at, 'DD')=to_char(now(),'DD')
AND to_char(l.created_at, 'MM')=to_char(now(),'MM')
AND to_char(l.created_at, 'YYYY')=to_char(now(),'YYYY') )
ORDER BY c.created_at DESC
;
`;

export const getGroups=`
SELECT g.id, g.group_name, g.group_number, g.group_room, g.created_at, g.updated_at,
	(SELECT COUNT(c.id) FROM child c WHERE c.group_id=g.id) AS child_count
	FROM group_kinder_garden g ORDER BY g.created_at DESC;
`;

export const addGroupQuery=`
INSERT INTO group_kinder_garden(
    group_name, group_number, group_room, created_at, updated_at)
    VALUES ($1, $2, $3, now(), now()) RETURNING *;
`;

export const getChildrenQuery=`
    SELECT c.id, c.name, c.surname, c.middle_name, 
    c.group_id, c.age, c.father_fullname, c.father_phone_number, 
    c.father_job_address, c.mother_fullname, c.mother_phone_number, c.mother_job_address, 
    c.phone_number_gender, c.child_image, c.child_caregiver, c.caregiver_phone_number, 
    c.kinder_garden_entered_date, c.kinder_garden_exited_date, c.full_information, 
    c.born_certificate_file, c.doc_file, c.gender, c.address, c.created_at, c.updated_at, c.qr_code,c.dob,g.group_name
    FROM child c 
    LEFT JOIN group_kinder_garden g ON g.id=c.group_id
    %s
    ORDER BY c.created_at DESC;
`;

export const getHistoryQuery = `
    SELECT l.id, 
        l.child_id, l.date_log, l.type, 
        l.time_log, l.is_late, l.late_duration, 
        l.is_delivery_sms, l.created_at, l.updated_at,
        c.name,c.surname,c.middle_name,c.father_fullname,c.mother_fullname,c.father_phone_number,c.mother_phone_number,
        c.phone_number_gender,c.child_image,c.child_caregiver,c.address,
        g.group_name
        FROM entire_log l
        LEFT JOIN child c ON c.id=l.child_id
        LEFT JOIN group_kinder_garden g ON g.id=c.group_id
        %s
        ORDER BY l.created_at DESC
        LIMIT $1 OFFSET ($2 - 1) * $1;
`;

export const getHistoryQueryCount = `
    SELECT l.id, 
        l.child_id, l.date_log, l.type, 
        l.time_log, l.is_late, l.late_duration, 
        l.is_delivery_sms, l.created_at, l.updated_at,
        c.name,c.surname,c.middle_name,c.father_fullname,c.mother_fullname,c.father_phone_number,c.mother_phone_number,
        c.phone_number_gender,c.child_image,c.child_caregiver,c.address,
        g.group_name
        FROM entire_log l
        LEFT JOIN child c ON c.id=l.child_id
        LEFT JOIN group_kinder_garden g ON g.id=c.group_id
        %s
        ORDER BY l.created_at DESC;
`;

export const getSingleChildQuery=`
    SELECT c.id, c.name, c.surname, c.middle_name, 
    c.group_id, c.age, c.father_fullname, c.father_phone_number, 
    c.father_job_address, c.mother_fullname, c.mother_phone_number, c.mother_job_address, 
    c.phone_number_gender, c.child_image, c.child_caregiver, c.caregiver_phone_number, 
    c.kinder_garden_entered_date, c.kinder_garden_exited_date, c.full_information, 
    c.born_certificate_file, c.doc_file, c.gender, c.address,c.health_doc, c.created_at, c.updated_at, c.qr_code,c.dob,g.group_name,g.group_number,g.group_room
    FROM child c 
    LEFT JOIN group_kinder_garden g ON g.id=c.group_id
    WHERE c.id=$1
    ORDER BY c.created_at DESC;
`;

export const removeChildQuery=`
    DELETE FROM child
    WHERE id=$1;    
`;

export const removeChildLog=`
    DELETE FROM entire_log
    WHERE child_id=$1;
`;


export const addChildQuery = `
INSERT INTO public.child(
	name, surname, middle_name, group_id, age, father_fullname, father_phone_number, father_job_address, mother_fullname, mother_phone_number, mother_job_address, phone_number_gender, child_image, child_caregiver, caregiver_phone_number, kinder_garden_entered_date, kinder_garden_exited_date, full_information, born_certificate_file, doc_file, gender, address, created_at, updated_at, qr_code, dob,health_doc)
	VALUES ($1, $2, $3, $4, 0, $5, $6, $7, $8, $9, $10, $11,$12, $13,$14, $15, $16, $17, $18, $19, $20, $21,now(), now(), $22, $23,$24) RETURNING *;
`;

export const updateChildQuery=`
    UPDATE public.child
	SET name=$1, surname=$2, middle_name=$3, group_id=$4, age=$5, father_fullname=$6, father_phone_number=$7, 
    father_job_address=$8, mother_fullname=$9, mother_phone_number=$10, 
    mother_job_address=$11, phone_number_gender=$12, child_image=$13, 
    child_caregiver=$14, caregiver_phone_number=$15, kinder_garden_entered_date=$16, 
    kinder_garden_exited_date=$17, full_information=$18, born_certificate_file=$19, doc_file=$20, 
    gender=$21, address=$22, updated_at=now(), dob=$23,health_doc=$24
	WHERE id=$25 RETURNING *;
`;

export const deleteLogQuery=`
    DELETE FROM entire_log WHERE id=$1;
`;

export const updateSmsQuery=`
    UPDATE public.sms_template SET sms=$1, updated_at='now()' RETURNING *;
`;

export const getSmsQuery=`
    SELECT id, sms, created_at, updated_at
    FROM public.sms_template ORDER BY updated_at DESC LIMIT 1;
`;

export const getSingleChildAndSmsQuery=`
    SELECT c.id, c.name, c.surname, c.middle_name, 
    c.group_id, c.age, c.father_fullname, c.father_phone_number, 
    c.father_job_address, c.mother_fullname, c.mother_phone_number, c.mother_job_address, 
    c.phone_number_gender, c.child_image, c.child_caregiver, c.caregiver_phone_number, 
    c.kinder_garden_entered_date, c.kinder_garden_exited_date, c.full_information, 
    c.born_certificate_file, c.doc_file, c.gender, c.address,c.health_doc, c.created_at, c.updated_at, c.qr_code,c.dob,g.group_name,g.group_number,g.group_room,
    (SELECT s.sms FROM sms_template s ORDER BY s.updated_at DESC LIMIT 1) as sms
    FROM child c 
    LEFT JOIN group_kinder_garden g ON g.id=c.group_id
    WHERE c.id=$1
    ORDER BY c.created_at DESC;
`;