PGDMP                         z            kinder_garden    13.2    14.2      ?           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            ?           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            ?           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            ?           1262    123675    kinder_garden    DATABASE     q   CREATE DATABASE kinder_garden WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'English_United States.1252';
    DROP DATABASE kinder_garden;
                postgres    false            ?            1259    123676    child    TABLE     ?  CREATE TABLE public.child (
    id bigint NOT NULL,
    name text,
    surname text,
    middle_name text,
    group_id bigint,
    age bigint DEFAULT 0,
    father_fullname text,
    father_phone_number text,
    father_job_address text,
    mother_fullname text,
    mother_phone_number text,
    mother_job_address text,
    phone_number_gender text,
    child_image text,
    child_caregiver text,
    caregiver_phone_number text,
    kinder_garden_entered_date text,
    kinder_garden_exited_date text,
    full_information text,
    born_certificate_file text,
    doc_file text,
    gender text,
    address text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    qr_code text,
    dob date
);
    DROP TABLE public.child;
       public         heap    postgres    false            ?            1259    123679    child_id_seq    SEQUENCE     u   CREATE SEQUENCE public.child_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.child_id_seq;
       public          postgres    false    200            ?           0    0    child_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.child_id_seq OWNED BY public.child.id;
          public          postgres    false    201            ?            1259    123693 
   entire_log    TABLE     O  CREATE TABLE public.entire_log (
    id bigint NOT NULL,
    child_id bigint,
    date_log date,
    type text,
    time_log text,
    is_late boolean DEFAULT false,
    late_duration bigint DEFAULT 0,
    is_delivery_sms boolean DEFAULT false,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);
    DROP TABLE public.entire_log;
       public         heap    postgres    false            ?            1259    123691    entire_log_id_seq    SEQUENCE     z   CREATE SEQUENCE public.entire_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.entire_log_id_seq;
       public          postgres    false    203            ?           0    0    entire_log_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.entire_log_id_seq OWNED BY public.entire_log.id;
          public          postgres    false    202            ?            1259    123707    group_kinder_garden    TABLE     ?   CREATE TABLE public.group_kinder_garden (
    id bigint NOT NULL,
    group_name text,
    group_number text,
    group_room text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);
 '   DROP TABLE public.group_kinder_garden;
       public         heap    postgres    false            ?            1259    123705    group_kinder_garden_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.group_kinder_garden_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.group_kinder_garden_id_seq;
       public          postgres    false    205            ?           0    0    group_kinder_garden_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.group_kinder_garden_id_seq OWNED BY public.group_kinder_garden.id;
          public          postgres    false    204            ?            1259    123718    users    TABLE     /  CREATE TABLE public.users (
    id bigint NOT NULL,
    username text,
    password text,
    fullname text,
    phone_number text,
    kinder_garden_name text,
    kinder_garden_address text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    user_role text
);
    DROP TABLE public.users;
       public         heap    postgres    false            ?            1259    123716    users_id_seq    SEQUENCE     u   CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    207            ?           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    206            8           2604    123681    child id    DEFAULT     d   ALTER TABLE ONLY public.child ALTER COLUMN id SET DEFAULT nextval('public.child_id_seq'::regclass);
 7   ALTER TABLE public.child ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    201    200            :           2604    123696    entire_log id    DEFAULT     n   ALTER TABLE ONLY public.entire_log ALTER COLUMN id SET DEFAULT nextval('public.entire_log_id_seq'::regclass);
 <   ALTER TABLE public.entire_log ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    203    202    203            >           2604    123710    group_kinder_garden id    DEFAULT     ?   ALTER TABLE ONLY public.group_kinder_garden ALTER COLUMN id SET DEFAULT nextval('public.group_kinder_garden_id_seq'::regclass);
 E   ALTER TABLE public.group_kinder_garden ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    205    204    205            ?           2604    123721    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    207    206    207            ?          0    123676    child 
   TABLE DATA           ?  COPY public.child (id, name, surname, middle_name, group_id, age, father_fullname, father_phone_number, father_job_address, mother_fullname, mother_phone_number, mother_job_address, phone_number_gender, child_image, child_caregiver, caregiver_phone_number, kinder_garden_entered_date, kinder_garden_exited_date, full_information, born_certificate_file, doc_file, gender, address, created_at, updated_at, qr_code, dob) FROM stdin;
    public          postgres    false    200   ['       ?          0    123693 
   entire_log 
   TABLE DATA           ?   COPY public.entire_log (id, child_id, date_log, type, time_log, is_late, late_duration, is_delivery_sms, created_at, updated_at) FROM stdin;
    public          postgres    false    203   A(       ?          0    123707    group_kinder_garden 
   TABLE DATA           o   COPY public.group_kinder_garden (id, group_name, group_number, group_room, created_at, updated_at) FROM stdin;
    public          postgres    false    205   +       ?          0    123718    users 
   TABLE DATA           ?   COPY public.users (id, username, password, fullname, phone_number, kinder_garden_name, kinder_garden_address, created_at, updated_at, user_role) FROM stdin;
    public          postgres    false    207   ?+       ?           0    0    child_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.child_id_seq', 11, true);
          public          postgres    false    201            ?           0    0    entire_log_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.entire_log_id_seq', 43, true);
          public          postgres    false    202            ?           0    0    group_kinder_garden_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.group_kinder_garden_id_seq', 3, true);
          public          postgres    false    204            ?           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 2, true);
          public          postgres    false    206            A           2606    123690    child child_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.child
    ADD CONSTRAINT child_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.child DROP CONSTRAINT child_pkey;
       public            postgres    false    200            C           2606    123704    entire_log entire_log_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.entire_log
    ADD CONSTRAINT entire_log_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.entire_log DROP CONSTRAINT entire_log_pkey;
       public            postgres    false    203            E           2606    123715 ,   group_kinder_garden group_kinder_garden_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.group_kinder_garden
    ADD CONSTRAINT group_kinder_garden_pkey PRIMARY KEY (id);
 V   ALTER TABLE ONLY public.group_kinder_garden DROP CONSTRAINT group_kinder_garden_pkey;
       public            postgres    false    205            G           2606    123726    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    207            ?   ?   x?}MKo?0>?_?}#?HBo=?ӦI???
?R?B;?~??U{?fY?g}/?]O]??,?<??8? ??/??f??km??V)??0?8?	6??$j??o/'?.?[h5?!?ѧ?,^?)Q?w4^????F???????+???L??1???w?#???????hO???!N??k@!m?e??
?J??6??K??XW?_?r)?]?"?,??qP}      ?   ?  x???K?+!E??*??F?oj-o?+???a?GAj)??	?n???7?Do?????K??q?????\腛??=J???V*T???xI?W͠Q???y?c?c?K ??L??mokE#w?o?I?#!?N??K????mR?mo?B?dq@?K??pE< ?MJJ?j????h?\N?&%??['k?0o?	`}2?F+?A????:b?*?>iŚ(/9'??OJ?o{%jU?????yF??sC???m}?X-?Ҝஃh?\??^h??D?gtF?sQ??o??+Or?)E5pn???G?^??9+?}?K9?E(???e??1??Q?J?	`???Hj??r??mI:!??Kj#??ڷ?6??+????P9+?g????,??*?J?[*kU?W??*? ??]???V?Tj??v@@?Ǩ(??)???Ȗ????????C????P,Y[?+=?!=Y\ńT??%k?E?>>v??о%E????o	?[?-??4?z???$?|>N`d??f?!`y?֔J?q?U*??"???4????W8uk?? ?ǌ??ۣ?G?K?????5??R???5?g?|]?l\??ʸz?O?$?????|??:.t??w?!න긥8.Vŋ?T????5?;?8[?V+??T???;????V????i???s???k??SKS???w??X?q???uV'?
 ??]@      ?   d   x?}?;
?0E?zfn ?y?ј?m??EЀ????XZ???׼??5???BPt?pu?$Tb?B
ѷ???4???kyO??`?U?$Ĥ????'????"?      ?   v   x?3?LL???C!?--?͍͌̍??8͍??s???+9?3??K8???t?u?ͭ?,?LL?,-???Ȁ??2???OOO-B?Ȳ????P????????
?=... gR=^     